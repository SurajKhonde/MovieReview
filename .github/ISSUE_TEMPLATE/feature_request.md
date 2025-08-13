name: "💡 Feature Request"
description: "Suggest a new feature or improvement for this project"
title: "[Feature] Real-Time Chat with WebSockets"
labels: [feature, enhancement, websocket, typescript]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        ## 💬 Feature: Real-Time Chat with WebSockets (Fan Club)

        Thanks for suggesting a feature! Please fill in the details below to help us understand and plan this better.

  - type: textarea
    id: related-problem
    attributes:
      label: "Is your feature request related to a problem?"
      description: "Describe the problem or limitation this feature would solve."
      placeholder: "E.g. I'm always frustrated when fan club members can't chat during events..."
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: "Describe the solution you'd like"
      description: "Explain your proposed solution. What should happen? What technologies do you suggest?"
      placeholder: "I'd like to add a real-time chat using WebSocket (e.g., Socket.IO), with typing indicators..."
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: "Describe alternatives you've considered"
      description: "List any other approaches or technologies you thought of or tried."
      placeholder: "I considered long-polling, or Discord embeds..."
    validations:
      required: false

  - type: textarea
    id: context
    attributes:
      label: "Additional context"
      description: "Any screenshots, diagrams, or context you'd like to provide?"
      placeholder: "This feature aligns with our engagement goals. Could later support emoji reactions, etc."
    validations:
      required: false

  - type: checkboxes
    id: technologies
    attributes:
      label: "What technologies are involved?"
      description: "Check the technologies relevant to this feature."
      options:
        - label: Node.js
          required: false
        - label: Socket.IO or native WebSocket
        - label: React
        - label: TypeScript (Frontend)
        - label: TypeScript (Backend)
        - label: Frontend State Management (e.g., Redux or Context API)

  - type: input
    id: github-username
    attributes:
      label: "GitHub Username (optional)"
      description: "Add your username if you'd like to be assigned or contribute to this feature."
      placeholder: "@your-username"
    validations:
      required: false
