#!/bin/bash

# BetaDomot Deployment Script
echo "🚀 BetaDomot Deployment Helper"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized and clean
check_git_status() {
    print_status "Checking git status..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a git repository. Please initialize git first."
        exit 1
    fi
    
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "You have uncommitted changes. Please commit them first."
        git status --short
        exit 1
    fi
    
    print_success "Git repository is clean"
}

# Check required files
check_required_files() {
    print_status "Checking required files..."
    
    required_files=(
        "backend/main.go"
        "backend/railway.toml"
        "frontend/package.json"
        "frontend/next.config.ts"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    print_success "All required files present"
}

# Test backend locally
test_backend() {
    print_status "Testing backend locally..."
    
    cd backend
    
    if ! command -v go &> /dev/null; then
        print_error "Go is not installed"
        exit 1
    fi
    
    # Check if .env exists
    if [[ ! -f ".env" ]]; then
        print_warning "No .env file found. Creating from example..."
        cp .env.example .env
        print_warning "Please edit backend/.env with your configuration"
    fi
    
    # Test build
    if go build -o main .; then
        print_success "Backend builds successfully"
        rm -f main
    else
        print_error "Backend build failed"
        exit 1
    fi
    
    cd ..
}

# Test frontend locally
test_frontend() {
    print_status "Testing frontend locally..."
    
    cd frontend
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if node_modules exists
    if [[ ! -d "node_modules" ]]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Test build
    if npm run build; then
        print_success "Frontend builds successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Main deployment steps
main() {
    echo
    print_status "Starting deployment preparation..."
    echo
    
    # Run checks
    check_git_status
    check_required_files
    test_backend
    test_frontend
    
    echo
    print_success "✅ All checks passed! Ready for deployment"
    echo
    print_status "Next steps:"
    echo "1. 🛤️  Deploy backend to Railway:"
    echo "   - Go to railway.app"
    echo "   - Create new project from GitHub"
    echo "   - Set root directory to 'backend'"
    echo "   - Configure environment variables"
    echo
    echo "2. ▲ Deploy frontend to Vercel:"
    echo "   - Go to vercel.com"
    echo "   - Import GitHub repository"
    echo "   - Set root directory to 'frontend'"
    echo "   - Configure environment variables"
    echo
    echo "3. 📖 Follow the complete guide:"
    echo "   - Read DEPLOYMENT_GUIDE.md for detailed instructions"
    echo
    print_success "Happy deploying! 🚀"
}

# Run main function
main