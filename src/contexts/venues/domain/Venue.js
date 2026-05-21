class Venue {
    constructor({ id, ownerId, name, description, address, city, lat, lng, phone, isActive, createdAt }) {
<<<<<<< HEAD
        this.id          = id;
        this.ownerId     = ownerId;
        this.name        = name;
        this.description = description ?? null;
        this.address     = address;
        this.city        = city;
        this.lat         = lat  ?? null;
        this.lng         = lng  ?? null;
        this.phone       = phone ?? null;
        this.isActive    = isActive ?? true;
        this.createdAt   = createdAt ?? new Date();
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
    }

    toPublic() {
        return {
<<<<<<< HEAD
            id:          this.id,
            ownerId:     this.ownerId,
            name:        this.name,
            description: this.description,
            address:     this.address,
            city:        this.city,
            lat:         this.lat,
            lng:         this.lng,
            phone:       this.phone,
            isActive:    this.isActive,
            createdAt:   this.createdAt,
=======
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
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        };
    }
}

module.exports = Venue;
