const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const { clearActorCache } = require("../utils/cacheHelper");
const clientPromise = require("../utils/redisClient");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");
const cloudinary = require("../cloud");

exports.createActor = async (req, res) => {
  
  const { name, about, gender } = req.body;
  const { file } = req;
  const newActor = new Actor({ name, about, gender });

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }
  await newActor.save();
  await clearActorCache();;
  res.status(201).json({ actor: formatActor(newActor) });
};

// update
// Things to consider while updating.
// No.1 - is image file is / avatar is also updating.
// No.2 - if yes then remove old image before uploading new image / avatar.

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;

  // remove old image if there was one!
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  // upload new avatar if there is one!
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();
  await clearActorCache();
  res.status(201).json({ actor: formatActor(actor) });
};

exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;

  // remove old image if there was one!
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  await Actor.findByIdAndDelete(actorId);
  await clearActorCache();
  res.json({ message: "Record removed successfully." });
};

exports.searchActor = async (req, res) => {
  const { name } = req.query;
  // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  if (!name.trim()) return sendError(res, "Invalid request!");
  const result = await Actor.find({
    name: { $regex: name, $options: "i" },
  });

  const actors = result.map((actor) => formatActor(actor));
  res.json({ results: actors });
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
};

exports.getSingleActor = async (req, res) => {
  const client = await clientPromise;
  const { id } = req.params;
  const cacheKey = `actor:${id}`;
  const cached = await client.get(cacheKey);
  
  if (!isValidObjectId(id)) return sendError(res, "Invalid request!");
  if (cached) {
    console.log("⚡ Single actor from cache");
    return res.json({ actor: JSON.parse(cached) });
  };
  const actor = await Actor.findById(id);
  
  if (!actor) return sendError(res, "Invalid request, actor not found!", 404);
  const formatted = formatActor(actor);
  await client.setEx(cacheKey, 3600, JSON.stringify(formatted));
  res.json({ actor: formatted });

};

exports.getActors = async (req, res) => {
  const client = await clientPromise; // wait for redis connection
  const { pageNo, limit } = req.query;
  const cacheKey = `actors:${pageNo}:${limit}`;
  const cached = await client.get(cacheKey);
  if (cached) {
    console.log("⚡ From cache");
    return res.json(JSON.parse(cached));
  }

  const actors = await Actor.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = actors.map((actor) => formatActor(actor));
  const response = { profiles };
  await client.setEx(cacheKey, 3600, JSON.stringify(response));

  res.json(response);
};
