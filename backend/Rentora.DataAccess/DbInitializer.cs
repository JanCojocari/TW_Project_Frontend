namespace Rentora.DataAccess;

using Rentora.Domain.Entities;
using Rentora.Domain.Enums;
using Rentora.Domain.OwnedTypes;

public static class DbInitializer
{
    public static void Seed()
    {
        using var db = new AppDbContext();

        // Ruleaza doar daca nu exista useri seed (evita duplicare la restart)
        if (db.Users.Any(u => u.Email.EndsWith("@rentora.md")))
            return;

        // ── Useri ────────────────────────────────────────────────────────────

        var owners = new List<User>
        {
            MakeUser("Alexandru", "Popescu",  "alex.popescu@rentora.md",      "Owner1Pass!", "+37369100001", "1985-03-12", "male",   Role.Owner),
            MakeUser("Maria",     "Ionescu",  "maria.ionescu@rentora.md",     "Owner2Pass!", "+37369100002", "1990-07-24", "female", Role.Owner),
            MakeUser("Dmitri",    "Lupu",     "dmitri.lupu@rentora.md",       "Owner3Pass!", "+37369100003", "1978-11-05", "male",   Role.Owner),
            MakeUser("Elena",     "Rusu",     "elena.rusu@rentora.md",        "Owner4Pass!", "+37369100004", "1995-01-18", "female", Role.Owner),
            MakeUser("Ion",       "Gheorghiu","ion.gheorghiu@rentora.md",     "Owner5Pass!", "+37369100005", "1982-06-30", "male",   Role.Owner),
            MakeUser("Natalia",   "Cojocaru", "natalia.cojocaru@rentora.md",  "Owner6Pass!", "+37369100006", "1988-09-14", "female", Role.Owner),
            MakeUser("Andrei",    "Botnaru",  "andrei.botnaru@rentora.md",    "Owner7Pass!", "+37369100007", "1975-04-22", "male",   Role.Owner),
            MakeUser("Cristina",  "Moraru",   "cristina.moraru@rentora.md",   "Owner8Pass!", "+37369100008", "1993-12-03", "female", Role.Owner),
            MakeUser("Vasile",    "Rotaru",   "vasile.rotaru@rentora.md",     "Owner9Pass!", "+37369100009", "1980-08-17", "male",   Role.Owner),
            MakeUser("Olga",      "Spataru",  "olga.spataru@rentora.md",      "Owner10Pass!","+37369100010", "1992-02-28", "female", Role.Owner),
        };

        var renters = new List<User>
        {
            MakeUser("Mihai",  "Popa",     "mihai.popa@rentora.md",     "Renter1Pass!", "+37369200001", "1998-05-10", "male",   Role.Renter, 5000m),
            MakeUser("Ana",    "Dinu",     "ana.dinu@rentora.md",       "Renter2Pass!", "+37369200002", "2000-11-25", "female", Role.Renter, 3500m),
            MakeUser("Sergiu", "Negrut",   "sergiu.negrut@rentora.md",  "Renter3Pass!", "+37369200003", "1996-03-07", "male",   Role.Renter, 8000m),
            MakeUser("Ioana",  "Ciobanu",  "ioana.ciobanu@rentora.md",  "Renter4Pass!", "+37369200004", "1999-08-19", "female", Role.Renter, 2000m),
            MakeUser("Victor", "Munteanu", "victor.munteanu@rentora.md","Renter5Pass!", "+37369200005", "1994-12-31", "male",   Role.Renter, 6500m),
        };

        db.Users.AddRange(owners);
        db.Users.AddRange(renters);
        db.SaveChanges();

        // ── Apartamente ───────────────────────────────────────────────────────

        var apartments = new List<Apartment>
        {
            MakeApartment(
                owners[0], "Bd. Stefan cel Mare 100, Chisinau",
                "[\"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200\",\"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200\",\"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200\"]",
                RentInterval.Month, 8500m, RentMode.LongTerm, ApartmentStatus.Approved,
                47.0245, 28.8322, "Chisinau",
                3, 1, 5, 9, 75.0, 4,
                "Apartament modern cu vedere panoramica asupra bulevardului principal. Renovat complet in 2022, mobilat premium cu electrocasnice noi.",
                CancellationPolicy.Flexible
            ),
            MakeApartment(
                owners[1], "Str. Trandafirilor 22, Botanica",
                "[\"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200\",\"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200\"]",
                RentInterval.Month, 4200m, RentMode.ShortTerm, ApartmentStatus.Approved,
                46.9920, 28.8650, "Chisinau",
                1, 1, 2, 5, 38.0, 2,
                "Studio confortabil in cartierul Botanica, zona linistita si verde. Ideal pentru o persoana sau cuplu.",
                CancellationPolicy.Flexible
            ),
            MakeApartment(
                owners[2], "Str. Alba Iulia 75, Buiucani",
                "[\"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200\",\"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200\",\"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200\"]",
                RentInterval.Month, 15000m, RentMode.LongTerm, ApartmentStatus.Approved,
                47.0380, 28.8100, "Chisinau",
                4, 2, 9, 9, 120.0, 6,
                "Penthouse exclusivist la ultimul etaj cu terasa privata si vedere la 360 de grade. Finisaje de lux, smart home integrat.",
                CancellationPolicy.Strict
            ),
            MakeApartment(
                owners[3], "Str. Calea Iesilor 14, Rascani",
                "[\"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200\",\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200\"]",
                RentInterval.Month, 5800m, RentMode.LongTerm, ApartmentStatus.Approved,
                47.0520, 28.8410, "Chisinau",
                2, 1, 3, 7, 58.0, 3,
                "Apartament cu 2 camere recent renovat in zona Rascani. Mobilat modern, geamuri cu vedere la parc.",
                CancellationPolicy.Moderate
            ),
            MakeApartment(
                owners[4], "Bd. Mircea cel Batran 12, Ciocana",
                "[\"https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200\",\"https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200\",\"https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200\"]",
                RentInterval.Month, 6200m, RentMode.LongTerm, ApartmentStatus.Approved,
                47.0150, 28.8900, "Chisinau",
                3, 1, 4, 8, 68.0, 5,
                "Apartament spatios cu 3 camere in Ciocana, etaj 4 cu balcon. Renovat in 2021, mobilat complet.",
                CancellationPolicy.Flexible
            ),
            MakeApartment(
                owners[5], "Str. Pushkin 32, Centru",
                "[\"https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200\",\"https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200\"]",
                RentInterval.Month, 3500m, RentMode.ShortTerm, ApartmentStatus.Approved,
                47.0215, 28.8295, "Chisinau",
                1, 1, 1, 4, 32.0, 1,
                "Garsoniera perfecta pentru student sau profesionist. La 5 minute de Universitatea de Stat. Internet fibra optica inclus.",
                CancellationPolicy.Flexible
            ),
            MakeApartment(
                owners[6], "Str. Sarmizegetusa 5, Telecentru",
                "[\"https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200\",\"https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200\",\"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200\"]",
                RentInterval.Month, 9500m, RentMode.LongTerm, ApartmentStatus.Approved,
                46.9980, 28.8720, "Chisinau",
                4, 2, 6, 10, 95.0, 8,
                "Apartament mare cu 4 camere ideal pentru familie. Doua bai, camera separata pentru copii, birou.",
                CancellationPolicy.Moderate
            ),
            MakeApartment(
                owners[7], "Str. 31 August 1989, nr. 45, Centru",
                "[\"https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=1200\",\"https://images.unsplash.com/photo-1512916194211-3f2b7f5f7f1a?w=1200\"]",
                RentInterval.Day, 650m, RentMode.ShortTerm, ApartmentStatus.Approved,
                47.0230, 28.8340, "Chisinau",
                2, 1, 3, 6, 55.0, 4,
                "Apartament pentru inchiriere zilnica in inima Chisinauului. La 3 minute de Parcul Central. Perfect pentru turisti.",
                CancellationPolicy.Flexible
            ),
            MakeApartment(
                owners[8], "Str. Florilor 8, Sculeni",
                "[\"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200\",\"https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200\",\"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200\"]",
                RentInterval.Month, 11000m, RentMode.LongTerm, ApartmentStatus.Approved,
                47.0610, 28.8050, "Chisinau",
                3, 2, 1, 2, 110.0, 6,
                "Duplex deosebit pe 2 niveluri in zona Sculeni. Curte proprie cu gazon, loc de parcare acoperit pentru 2 masini.",
                CancellationPolicy.Strict
            ),
            MakeApartment(
                owners[9], "Str. Armeneasca 28, Centru",
                "[\"https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200\",\"https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200\",\"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200\"]",
                RentInterval.Month, 9000m, RentMode.ShortTerm, ApartmentStatus.Approved,
                47.0200, 28.8370, "Chisinau",
                1, 1, 3, 4, 65.0, 2,
                "Loft cu design industrial unic — tavane inalte de 4m, caramida aparenta, lumina naturala abundenta. Zona Armeneasca.",
                CancellationPolicy.Moderate
            ),
        };

        db.Apartments.AddRange(apartments);
        db.SaveChanges();

        // ── Facilities pentru fiecare apartament ──────────────────────────────

        foreach (var facility in apartments)
        {
            db.Facilities.Add(new Facilities
            {
                ApartmentId     = facility.Id,
                Wifi            = true,
                Parking         = true,
                AirConditioning = true,
                Heating         = true,
                Washer          = true,
                Dryer           = false,
                Kitchen         = true,
                TV              = true,
                Pool            = false,
                Gym             = false,
                Elevator        = true,
                PetsAllowed     = false,
                Balcony         = true,
            });
        }
        db.SaveChanges();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static User MakeUser(
        string name, string surname, string email, string password,
        string phone, string birthday, string gender, Role role,
        decimal balance = 0m) => new User
    {
        Name           = name,
        Surname        = surname,
        Email          = email,
        PasswordHash   = HashPassword(password),
        Phone          = phone,
        Birthday       = DateTime.Parse(birthday),
        Gender         = gender,
        Role           = role,
        AccountBalance = balance,
    };

    private static Apartment MakeApartment(
        User owner, string address, string imageUrl,
        RentInterval interval, decimal cost, RentMode mode, ApartmentStatus status,
        double lat, double lng, string city,
        int rooms, int bathrooms, int floor, int totalFloors, double area, int maxGuests,
        string description, CancellationPolicy cancellation) => new Apartment
    {
        Owner           = owner,
        Address         = address,
        ImageUrl        = imageUrl,
        Interval        = interval,
        CostPerInterval = cost,
        RentMode        = mode,
        Status          = status,
        Location        = new MapLocation
        {
            Lat         = lat,
            Lng         = lng,
            City        = city,
            Country     = "Moldova",
            FullAddress = address,
        },
        AdditionlaInfo = new AdditionalInfo
        {
            Rooms              = rooms,
            Bathrooms          = bathrooms,
            Floor              = floor,
            TotalFloors        = totalFloors,
            Area               = area,
            MaxGuests          = maxGuests,
            Description        = description,
            CancellationPolicy = cancellation,
        },
    };

    private static string HashPassword(string password) =>
        Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(password)));
}