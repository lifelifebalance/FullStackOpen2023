```mermaid
sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: GET request for data.json
    Server->>Browser: Response (data.json)
    Browser->>Browser: Parse and store notes data
    Browser->>Browser: Render notes list
```