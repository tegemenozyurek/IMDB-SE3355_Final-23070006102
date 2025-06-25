# IMDB Movie Database

A modern movie database application built with Angular, featuring user authentication, movie management, and a responsive design.

## Features

- **User Authentication**: Login and registration system with email/password and Gmail integration
- **MVC Architecture**: Model-View-Controller pattern implementation
- **TypeScript**: Full type safety and modern JavaScript features
- **Responsive Design**: Mobile-friendly interface
- **Country/City Selection**: Dynamic dropdowns for user registration
- **Route Protection**: AuthGuard for protected routes

## Technologies Used

- Angular 17
- TypeScript
- CSS3 with modern design
- Local Storage for session management

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tegemenozyurek/IMDB-SE3355_Final-23070006102.git
```

2. Navigate to the project directory:
```bash
cd IMDB-SE3355_Final-23070006102
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:4200`

## Demo Credentials

- **Username**: `user`
- **Password**: `123456`

## Project Structure

```
src/
├── app/
│   ├── models/          # Data models and interfaces
│   ├── services/        # Business logic and API services
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── guards/         # Route protection
│   └── app.component.* # Main application component
├── assets/             # Static assets
└── styles/            # Global styles
```

## Features Overview

### Authentication System
- User registration with validation
- Login with username/password
- Gmail login simulation
- Session management with localStorage
- Route protection with AuthGuard

### User Interface
- Modern, responsive design
- Login/Register form with mode switching
- Country and city selection dropdowns
- Error handling and validation messages
- Loading states and animations

### Architecture
- MVC pattern implementation
- Service-based architecture
- Component-based UI structure
- Type-safe interfaces and models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Author

**Egemen Özyürek**
- GitHub: [@tegemenozyurek](https://github.com/tegemenozyurek)
- Student ID: 23070006102
- Course: SE3355 Final Project
