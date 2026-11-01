using FluentAssertions;
using Yademoon.Domain;

namespace Yademoon.Tests;

public class NextBirthdayCalculatorTests
{
    [Fact]
    public void Jalali_Gregorian_roundtrip_preserves_day()
    {
        var g = NextBirthdayCalculator.ToGregorianSafe(1403, 1, 1);
        g.Should().Be(new DateOnly(2024, 3, 20));
        var j = NextBirthdayCalculator.ToJalali(g);
        j.Should().Be((1403, 1, 1));
    }

    [Fact]
    public void Birthday_today_returns_today()
    {
        var today = NextBirthdayCalculator.ToGregorianSafe(1403, 3, 20);
        var birth = NextBirthdayCalculator.ToGregorianSafe(1370, 3, 20);
        var next = NextBirthdayCalculator.GetNextBirthday(birth, today);
        next.Should().Be(today);
        NextBirthdayCalculator.DaysUntil(birth, today).Should().Be(0);
    }

    [Fact]
    public void Birthday_tomorrow_returns_one_day()
    {
        var today = NextBirthdayCalculator.ToGregorianSafe(1403, 3, 20);
        var birth = NextBirthdayCalculator.ToGregorianSafe(1370, 3, 21);
        NextBirthdayCalculator.DaysUntil(birth, today).Should().Be(1);
    }

    [Fact]
    public void Year_wrap_uses_next_jalali_year()
    {
        var today = NextBirthdayCalculator.ToGregorianSafe(1403, 2, 1);
        var birth = NextBirthdayCalculator.ToGregorianSafe(1370, 1, 15);
        var next = NextBirthdayCalculator.GetNextBirthday(birth, today);
        var nj = NextBirthdayCalculator.ToJalali(next);
        nj.Year.Should().Be(1404);
        nj.Month.Should().Be(1);
        nj.Day.Should().Be(15);
    }

    [Fact]
    public void Esfand_30_in_non_leap_year_observes_on_29()
    {
        NextBirthdayCalculator.IsPersianLeapYear(1399).Should().BeTrue();
        NextBirthdayCalculator.IsPersianLeapYear(1400).Should().BeFalse();

        var birthOn30Esfand = NextBirthdayCalculator.ToGregorianSafe(1399, 12, 30);
        var jBirth = NextBirthdayCalculator.ToJalali(birthOn30Esfand);
        jBirth.Month.Should().Be(12);
        jBirth.Day.Should().Be(30);

        var today = NextBirthdayCalculator.ToGregorianSafe(1400, 1, 1);
        var next = NextBirthdayCalculator.GetNextBirthday(birthOn30Esfand, today);
        var nj = NextBirthdayCalculator.ToJalali(next);
        nj.Year.Should().Be(1400);
        nj.Month.Should().Be(12);
        nj.Day.Should().Be(29);
    }

    [Fact]
    public void Esfand_30_in_leap_year_stays_30()
    {
        NextBirthdayCalculator.IsPersianLeapYear(1403).Should().BeTrue();
        var birth = NextBirthdayCalculator.ToGregorianSafe(1399, 12, 30);
        var today = NextBirthdayCalculator.ToGregorianSafe(1403, 1, 1);
        var next = NextBirthdayCalculator.GetNextBirthday(birth, today);
        var nj = NextBirthdayCalculator.ToJalali(next);
        nj.Year.Should().Be(1403);
        nj.Month.Should().Be(12);
        nj.Day.Should().Be(30);
    }

    [Fact]
    public void No_timezone_day_shift_on_date_only()
    {
        var d = new DateOnly(1995, 3, 20);
        d.ToString("yyyy-MM-dd").Should().Be("1995-03-20");
        DateOnly.ParseExact("1995-03-20", "yyyy-MM-dd").Should().Be(d);
    }
}
