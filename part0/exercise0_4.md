```mermaid
sequenceDiagram
    participant browser
    participant server
    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    server-->>-browser: Redirects to location: /exampleapp/notes
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>-browser: HTML document
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>-browser: CSS file (main.css)
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server-->>-browser: JavaScript file (main.js)
    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>-browser: data.json with JSON object
    Note right of browser: The browser executes the callback function that renders the notes
```