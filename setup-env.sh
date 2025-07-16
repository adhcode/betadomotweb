#!/bin/bash

# Environment Setup Script for BetaDomot
echo "🔧 BetaDomot Environment Setup"
echo "=============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Setup backend environment
setup_backend_env() {
    print_info "Setting up backend environment..."
    
    if [[ ! -f "backend/.env" ]]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from example"
        print_warning "Please edit backend/.env with your actual values:"
        echo "  - SUPABASE_URL"
        echo "  - SUPABASE_KEY"
        echo "  - RESEND_API_KEY"
        echo "  - ADMIN_USERNAME"
        echo "  - ADMIN_PASSWORD"
    else
        print_info "backend/.env already exists"
    fi
}

# Setup frontend environment
setup_frontend_env() {
    print_info "Setting up frontend environment..."
    
    if [[ ! -f "frontend/.env.local" ]]; then
        cp frontend/.env.production.example frontend/.env.local
        print_success "Created frontend/.env.local from example"
        print_warning "Please edit frontend/.env.local with your actual values:"
        echo "  - NEXT_PUBLIC_API_URL (your Railway backend URL)"
        echo "  - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
        echo "  - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
    else
        print_info "frontend/.env.local already exists"
    fi
}

# Main setup
main() {
    setup_backend_env
    echo
    setup_frontend_env
    echo
    print_success "Environment setup complete!"
    echo
    print_info "Next steps:"
    echo "1. Edit the .env files with your actual credentials"
    echo "2. Run './deploy.sh' to test and prepare for deployment"
    echo "3. Follow DEPLOYMENT_GUIDE.md for deployment instructions"
}

main