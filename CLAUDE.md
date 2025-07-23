# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript frontend for a Markdown Note App, built with Vite as the build tool. The project is initialized and ready for development.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Tech Stack

- **React 19.1.0** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 7.0.4** - Build tool and dev server
- **ESLint** - Code linting with React-specific rules

## Project Structure

Standard Vite React TypeScript structure:
- `src/` - Source code
- `public/` - Static assets
- `index.html` - Entry HTML file
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Development Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access at http://localhost:5173

## Planned Implementation

This React frontend will replace the existing vanilla JavaScript prototype and implement:
- Component-based architecture
- TypeScript for type safety
- Modern React patterns with hooks
- Responsive design
- Integration with planned Express backend

## Code Quality

- ESLint configured with React hooks and refresh plugins
- TypeScript strict mode enabled
- Modern ES modules (type: "module" in package.json)