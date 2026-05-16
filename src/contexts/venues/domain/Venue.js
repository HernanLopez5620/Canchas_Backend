class Venue {
    constructor({ id, ownerId, name, description, address, city, lat, lng, phone, isActive, createdAt }) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description ?? null;
        this.address = address;
        this.city = city;
        this.lat = lat ?? null;
        this.lng = lng ?? null;
        this.phone = phone ?? null;
        this.isActive = isActive ?? true;
        this.createdAt = createdAt ?? new Date();
    }

    toPublic() {
        return {
            id: this.id,
            ownerId: this.ownerId,
            name: this.name,
            description: this.description,
            address: this.address,
            city: this.city,
            lat: this.lat,
            lng: this.lng,
            phone: this.phone,
            isActive: this.isActive,
            createdAt: this.createdAt,
        };
    }
}

module.exports = Venue;
