<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'value',
    ];

    /**
     * Get options by type, with a fallback to defaults.
     *
     * @param string $type
     * @param array $default
     * @return array
     */
    public static function getValues(string $type, array $default = []): array
    {
        // Statuses are not ordered alphabetically so we preserve order or fallback order, but other types can be ordered.
        // For statuses we might want to keep the seeder order or custom order (like by ID), or just standard order.
        // Let's order by id so the creation order is preserved.
        return self::where('type', $type)->orderBy('id')->pluck('value')->toArray() ?: $default;
    }
}
