namespace Yademoon.Domain;

public class Person
{
    public Guid Id { get; set; }
    public string OwnerUserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public RelationType Relation { get; set; }
    /// <summary>Gregorian calendar date only — never store as timestamptz.</summary>
    public DateOnly BirthDate { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
