using System.Globalization;

namespace Yademoon.Domain;

/// <summary>
/// Computes the next birthday occurrence from a stored Gregorian birth date,
/// using Jalali month/day as the anniversary key.
/// Rule: ۳۰ اسفند in a non-leap Jalali year observes on ۲۹ اسفند (last day of Esfand).
/// </summary>
public static class NextBirthdayCalculator
{
    private static readonly PersianCalendar Persian = new();

    public static DateOnly GetNextBirthday(DateOnly birthDateGregorian, DateOnly todayGregorian)
    {
        var jy = Persian.GetYear(birthDateGregorian.ToDateTime(TimeOnly.MinValue));
        var jm = Persian.GetMonth(birthDateGregorian.ToDateTime(TimeOnly.MinValue));
        var jd = Persian.GetDayOfMonth(birthDateGregorian.ToDateTime(TimeOnly.MinValue));

        var todayJy = Persian.GetYear(todayGregorian.ToDateTime(TimeOnly.MinValue));

        for (var year = todayJy; year <= todayJy + 1; year++)
        {
            var occurrence = ToGregorianSafe(year, jm, jd);
            if (occurrence >= todayGregorian)
                return occurrence;
        }

        // Fallback: year + 2 (should be unreachable for normal calendars)
        return ToGregorianSafe(todayJy + 2, jm, jd);
    }

    public static int DaysUntil(DateOnly birthDateGregorian, DateOnly todayGregorian)
    {
        var next = GetNextBirthday(birthDateGregorian, todayGregorian);
        return next.DayNumber - todayGregorian.DayNumber;
    }

    /// <summary>
    /// Maps Jalali y/m/d to Gregorian. If day exceeds days in that month
    /// (e.g. ۳۰ اسفند in a common year), clamps to the last day of the month (۲۹ اسفند).
    /// </summary>
    public static DateOnly ToGregorianSafe(int jalaliYear, int jalaliMonth, int jalaliDay)
    {
        var daysInMonth = Persian.GetDaysInMonth(jalaliYear, jalaliMonth);
        var day = Math.Min(jalaliDay, daysInMonth);
        var dt = Persian.ToDateTime(jalaliYear, jalaliMonth, day, 0, 0, 0, 0);
        return DateOnly.FromDateTime(dt);
    }

    public static (int Year, int Month, int Day) ToJalali(DateOnly gregorian)
    {
        var dt = gregorian.ToDateTime(TimeOnly.MinValue);
        return (
            Persian.GetYear(dt),
            Persian.GetMonth(dt),
            Persian.GetDayOfMonth(dt)
        );
    }

    public static bool IsPersianLeapYear(int jalaliYear) =>
        Persian.IsLeapYear(jalaliYear);
}
