# 🔐 Admin System Guide

## Overview

The admin system provides a comprehensive interface for managing your blog content, including posts, comments, and newsletter subscribers.

## 🚀 Quick Start

### 1. Access the Admin Dashboard

**Web Interface:**

```
http://localhost:8080/admin-ui
```

**Default Credentials:**

- Username: `admin`
- Password: `admin123`

> ⚠️ **Security Warning**: Change the default password in production!

### 2. Set Custom Admin Credentials

Add to your `.env` file:

```bash
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

## 📊 Admin Dashboard Features

### Dashboard Overview

- **Total Posts**: Number of published blog posts
- **Total Views**: Cumulative view count across all posts
- **Total Comments**: Number of comments across all posts
- **Newsletter Subscribers**: Active subscriber count

### Posts Management

- View all posts with metadata
- Edit post content (coming soon)
- Delete posts (removes post and all associated comments)
- View post statistics (views, comments)

### Comments Moderation

- View all comments across all posts
- See comment details (author, email, content, date)
- Delete inappropriate comments
- Moderate comments by post

### Newsletter Management

- View all subscribers with status
- Export subscriber list as CSV
- See subscription sources (website, sidebar, etc.)
- Track subscription dates

## 🔌 API Endpoints

### Authentication

All admin endpoints require HTTP Basic Authentication:

```bash
curl -u admin:password http://localhost:8080/admin/endpoint
```

### Dashboard

```bash
GET /admin/dashboard
```

Returns overview statistics.

### Posts Management

```bash
GET /admin/posts?limit=20&offset=0    # List posts
PUT /admin/posts/{slug}               # Update post
DELETE /admin/posts/{slug}            # Delete post
```

### Comments Management

```bash
GET /admin/comments?limit=50&offset=0  # List comments
DELETE /admin/comments/{id}            # Delete comment
```

### Newsletter Management

```bash
GET /admin/subscribers?limit=100&offset=0  # List subscribers
GET /admin/subscribers/export             # Export CSV
```

## 🛠️ Usage Examples

### 1. View Dashboard Stats

```bash
curl -u admin:admin123 http://localhost:8080/admin/dashboard
```

### 2. List All Posts

```bash
curl -u admin:admin123 http://localhost:8080/admin/posts
```

### 3. Delete a Comment

```bash
curl -u admin:admin123 -X DELETE http://localhost:8080/admin/comments/{comment-id}
```

### 4. Export Newsletter Subscribers

```bash
curl -u admin:admin123 http://localhost:8080/admin/subscribers/export > subscribers.csv
```

## 🎯 Admin UI Features

### Dashboard

- **Real-time Statistics**: Auto-refreshing stats
- **Visual Overview**: Clean, card-based layout
- **Navigation**: Easy switching between sections

### Posts Section

- **Post List**: Paginated table with key info
- **Quick Actions**: Edit and delete buttons
- **Search/Filter**: Coming soon

### Comments Section

- **Comment Moderation**: Review all comments
- **Bulk Actions**: Coming soon
- **Spam Detection**: Coming soon

### Newsletter Section

- **Subscriber Management**: View all subscribers
- **Export Tools**: CSV download
- **Analytics**: Subscription sources and trends

## 🔒 Security Features

### Authentication

- HTTP Basic Authentication
- Environment-based credentials
- Secure password storage

### Authorization

- Admin-only access to management endpoints
- Protected routes with middleware
- Session management

### Data Protection

- Input validation on all endpoints
- SQL injection protection via Supabase
- CORS configuration for API access

## 📱 Mobile Responsive

The admin interface is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🚀 Future Enhancements

### Planned Features

- [ ] Rich text editor for posts
- [ ] Bulk comment moderation
- [ ] Advanced analytics dashboard
- [ ] User role management
- [ ] Email template editor
- [ ] Automated spam detection
- [ ] Content scheduling
- [ ] SEO optimization tools

### Advanced Features

- [ ] Two-factor authentication
- [ ] Activity logging
- [ ] Backup and restore
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Plugin system

## 🔧 Troubleshooting

### Common Issues

**1. Authentication Failed**

- Check username/password in `.env`
- Verify credentials are correct
- Ensure Basic Auth header is properly formatted

**2. Admin UI Not Loading**

- Verify server is running on correct port
- Check `./admin/index.html` file exists
- Ensure CORS is properly configured

**3. API Endpoints Not Working**

- Confirm server is running
- Check authentication headers
- Verify endpoint URLs are correct

**4. Database Connection Issues**

- Verify Supabase credentials
- Check network connectivity
- Ensure database tables exist

### Debug Commands

```bash
# Check server status
curl http://localhost:8080/health

# Test authentication
curl -u admin:admin123 http://localhost:8080/admin/dashboard

# Check server logs
go run . # View console output
```

## 📞 Support

For issues or feature requests:

1. Check the troubleshooting section
2. Review server logs
3. Verify configuration settings
4. Test with curl commands

## 🎉 Success!

Your admin system is now ready to manage your blog efficiently. The interface provides powerful tools while maintaining security and ease of use.
