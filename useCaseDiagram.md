# Use Case Diagram

```mermaid
usecaseDiagram
    actor Admin
    actor Developer
    actor Viewer
    actor System

    package "Auth & User Management" {
        usecase "Login / Logout" as UC1
        usecase "Manage Users" as UC2
        usecase "Manage Roles" as UC3
    }

    package "Service Monitoring" {
        usecase "View Dashboard" as UC4
        usecase "Add / Edit Service" as UC5
        usecase "View Real-time Metrics" as UC6
        usecase "View Service Logs" as UC7
    }

    package "Incident Management" {
        usecase "Report Incident" as UC8
        usecase "Update Incident Status" as UC9
        usecase "Comment on Incident" as UC10
        usecase "View Incidents" as UC11
    }

    package "Alerts & Notifications" {
        usecase "Configure Alerts" as UC12
        usecase "Receive Notifications" as UC13
    }

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13

    Developer --> UC1
    Developer --> UC4
    Developer --> UC6
    Developer --> UC7
    Developer --> UC9
    Developer --> UC10
    Developer --> UC11
    Developer --> UC13

    Viewer --> UC1
    Viewer --> UC4
    Viewer --> UC6
    Viewer --> UC7
    Viewer --> UC11

    System --> UC13 : "Trigger Alerts"
```
