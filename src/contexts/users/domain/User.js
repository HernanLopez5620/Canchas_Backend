class User {
    constructor({ id, name, email, phone, password, role, avatarUrl, isActive, createdAt }) {
        this.id        = id;
        this.name      = name;
        this.email     = email;
        this.phone     = phone;
        this.password  = password;
        this.role      = role      ?? 'player';
        this.avatarUrl = avatarUrl ?? null;
        this.isActive  = isActive  ?? true;
        this.createdAt = createdAt ?? new Date();
    }

    toPublic() {
        return {
            id:        this.id,
            name:      this.name,
            email:     this.email,
            phone:     this.phone,
            role:      this.role,
            avatarUrl: this.avatarUrl,
            isActive:  this.isActive,
            createdAt: this.createdAt,
        };
    }
}

module.exports = User;
