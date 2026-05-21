class Court {
    constructor({ id, venueId, sportId, name, description, surface, isIndoor, basePrice, capacity, isActive, createdAt }) {
        this.id          = id;
        this.venueId     = venueId;
        this.sportId     = sportId;
        this.name        = name;
        this.description = description ?? null;
        this.surface     = surface     ?? null;
        this.isIndoor    = isIndoor    ?? false;
        this.basePrice   = basePrice;
        this.capacity    = capacity    ?? null;
        this.isActive    = isActive    ?? true;
        this.createdAt   = createdAt   ?? new Date();
    }

    toPublic() {
        return {
            id:          this.id,
            venueId:     this.venueId,
            sportId:     this.sportId,
            name:        this.name,
            description: this.description,
            surface:     this.surface,
            isIndoor:    this.isIndoor,
            basePrice:   this.basePrice,
            capacity:    this.capacity,
            isActive:    this.isActive,
            createdAt:   this.createdAt,
        };
    }
}

module.exports = Court;
