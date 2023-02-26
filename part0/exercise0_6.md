```mermaid
sequenceDiagram
    participant browser
    participant server
    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: The request contains the new note as JSON data : content and timestamp (date)
    server-->>-browser: JSON object as {"message":"note created"}
    ```