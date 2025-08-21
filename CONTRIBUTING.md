# 🤝 Contributing to Solar System

Thank you for your interest in contributing to the Solar System project! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)
- Git

### Setting up the development environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/solar-system.git
   cd solar-system
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 🔄 Development Workflow

### Creating a new feature or fixing a bug

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run all tests
   npm test
   
   # Run with coverage
   npm run test:coverage
   
   # Build the project
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new planet animation feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Wait for review and feedback

## 📝 Commit Message Guidelines

We follow conventional commits for clear history:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` updating build tasks, package manager configs, etc.

Examples:
```bash
feat: add Saturn ring animation
fix: resolve planet texture loading issue
docs: update README with new features
test: add unit tests for planet component
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve test coverage
- Use descriptive test names
- Follow the existing test patterns

### Test Structure

```typescript
describe('Component Name', () => {
  describe('Feature Group', () => {
    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run for CI
npm run test:ci
```

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types for props
- Follow the existing file structure

### Three.js / React Three Fiber

- Use React Three Fiber patterns
- Keep 3D logic in separate components
- Use proper cleanup for animations
- Test 3D components with mocks

### CSS

- Use CSS Modules for styling
- Follow the existing naming conventions
- Keep styles modular and reusable
- Use semantic class names

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   └── *.module.css    # Component styles
├── shaders/            # GLSL shaders
│   └── __tests__/      # Shader tests
├── __tests__/          # App-level tests
├── test-utils.tsx      # Test utilities
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

Use the bug report template when creating issues.

## 💡 Feature Requests

When suggesting features:

- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Check if similar features exist

Use the feature request template when creating issues.

## 🔍 Code Review Process

### For Contributors

- Ensure your code follows the style guidelines
- Write clear PR descriptions
- Respond to feedback promptly
- Keep PRs focused and small when possible

### For Reviewers

- Be constructive and helpful
- Focus on code quality and maintainability
- Test the changes locally if needed
- Approve when ready or request changes

## 🚀 Deployment

- Main branch automatically deploys to Vercel
- All PRs get preview deployments
- CI/CD pipeline runs on all changes
- Manual deployment is possible for maintainers

## 📞 Getting Help

If you need help:

1. Check existing issues and discussions
2. Read the documentation
3. Ask questions in GitHub Discussions
4. Join our community chat (if available)

## 🙏 Recognition

Contributors will be:

- Listed in the README
- Mentioned in release notes
- Credited in commit messages
- Given maintainer access for significant contributions

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Solar System! 🌌✨
