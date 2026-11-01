using Yademoon.Application.Dtos;
using Yademoon.Domain;

namespace Yademoon.Application.Services;

public static class PersonMapper
{
    public static PersonDto ToDto(Person person, DateOnly today)
    {
        var next = NextBirthdayCalculator.GetNextBirthday(person.BirthDate, today);
        var days = next.DayNumber - today.DayNumber;
        var (_, jm, jd) = NextBirthdayCalculator.ToJalali(person.BirthDate);
        return new PersonDto(
            person.Id,
            person.Name,
            person.Relation,
            person.BirthDate.ToString("yyyy-MM-dd"),
            person.Notes,
            next.ToString("yyyy-MM-dd"),
            days,
            jm,
            jd);
    }
}
