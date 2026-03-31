# trade-offs.md

## Technical Trade-offs

Strategic decisions balancing development efficiency and core functionality.

## Decision Matrix

| Component | Chosen | Advantage | Trade-off | Alternative |
|-----------|--------|-----------|-----------|-------------|
| **Authentication** | JWT + localStorage | Simple, cross-tab sync | XSS exposure | httpOnly cookies |
| **Database** | MySQL + manual schema | Instant setup | Manual management | ORM migrations |
| **State Management** | useState + useNavigate | Zero dependencies | Manual coordination | Redux/Context |
| **Timer** | Client-side countdown | Responsive UI | Client manipulation | Server-side timing |
| **Deployment** | Local development | Zero configuration | Environment specific | Docker containers |

## Development Philosophy
Speed of Delivery > Architectural Complexity
Core Functionality > Edge Case Polish


**Outcome:** Complete, functional quiz application with timer, resume, and role-based access delivered rapidly while maintaining clean, readable code.
