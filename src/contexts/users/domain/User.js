class User {
    constructor({ id, name, email, phone, passwordHash, role, avatarUrl, isActive, createdAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.role = role ?? 'player';
        this.avatarUrl = avatarUrl ?? null;
        this.isActive = isActive ?? true;
        this.createdAt = createdAt ?? new Date();
    }

    isOwner() { return this.role === 'owner'; }
    isAdmin() { return this.role === 'admin'; }
    isPlayer() { return this.role === 'player'; }

    // Nunca exponer el hash fuera del dominio
    toPublic() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            role: this.role,
            avatarUrl: this.avatarUrl,
            createdAt: this.createdAt,
        };
    }
}

module.exports = User;
