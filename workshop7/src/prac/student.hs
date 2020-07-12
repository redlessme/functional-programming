module Students where
    import Data.List ( sort )
    
    rawStudents ::
        [(String, String, Integer, Integer, Integer, Integer)]
    rawStudents = [("Noelle","Stevenson",11,14,8,12),("Tessa","Erickson",12,18,9,18),("Leilani","Brandt",2,16,13,15),("Lamar","Gross",9,7,6,32),("Karley","Graves",16,12,2,33),("Lana","Chandler",18,13,4,35),("Keegan","Hart",12,11,1,39),("Marlee","Owen",20,17,16,32),("Christina","Valdez",7,11,14,22),("Harper","Cooke",3,19,13,17),("Francisco","Dodson",11,11,5,4),("Logan","Beltran",15,16,1,28),("Morgan","Garza",17,6,18,11),("Zain","Aguirre",7,4,19,4),("Myles","Ashley",0,2,0,7),("Teagan","Salinas",0,10,0,2),("Zander","Castaneda",0,19,13,19),("Yareli","Morris",15,19,14,22),("Reed","Sims",5,19,11,13),("Brylee","Wolfe",14,18,8,13),("Abdiel","Rangel",20,4,2,31),("Mireya","Blackburn",3,2,13,12),("Heather","Collier",5,19,11,39),("Aubree","Bernard",18,5,19,6),("Conner","Myers",5,4,20,26),("Tamia","Cline",14,13,10,4),("Alessandro","Potter",9,10,18,11),("Derick","Jenkins",14,17,0,31),("Neveah","Camacho",8,1,18,20),("Molly","Patel",13,9,0,30),("Mitchell","Sanford",7,2,17,11),("Cecelia","Sutton",9,3,15,9),("Brenda","Ellison",5,20,16,18),("Ignacio","Howe",1,11,6,4),("Sofia","Cox",15,9,16,16),("Alivia","Becker",4,17,10,1),("Lorena","Rosales",9,8,2,4),("Daniel","Roberson",14,6,15,7),("Alyvia","Andrews",8,11,2,20),("Oswaldo","Trujillo",15,16,20,5),("Sage","Daniel",18,19,12,18),("Joselyn","Fowler",14,13,19,32),("Conrad","Dixon",6,5,3,11),("Gustavo","Villanueva",11,1,13,35),("Toby","Hale",18,19,10,19),("Xander","Arellano",20,1,12,4),("Issac","Walsh",18,9,10,3),("Paityn","Bridges",14,6,13,0),("William","Dunn",14,19,11,40),("Lexi","Norman",1,4,0,11),("Aliyah","Horn",2,13,15,34),("Lilly","Knox",1,20,19,38),("Jimena","Ortiz",18,4,14,30),("Azul","Joseph",15,9,2,38),("Jessica","Reyes",18,18,12,17),("Shaylee","Cowan",2,0,10,20),("Lydia","Andrade",18,4,16,39),("Alejandro","Lewis",8,14,10,15),("Lincoln","Gallegos",7,10,1,23),("Braedon","Delgado",18,17,5,30),("Miley","Buck",1,6,11,22),("Annie","Yu",8,0,9,19),("Josue","Booker",8,6,9,38),("Zachariah","Stark",5,10,20,33),("Paxton","Hampton",1,15,4,0),("Gia","Rasmussen",18,10,10,39),("Jaydon","Lowery",18,6,14,2),("Dylan","Deleon",16,11,0,17),("Diamond","Daniels",13,15,8,19),("Emilia","Russo",9,9,13,0),("Harmony","Clay",16,15,14,18),("Marcelo","Hensley",11,6,0,23),("Darnell","Rojas",12,16,10,20),("Leroy","Beasley",13,0,3,39),("Amira","Gibbs",14,8,17,26),("Hector","Bond",13,7,3,31),("Marisol","Campos",15,3,9,25),("Kaia","Levine",5,13,2,34),("Itzel","Jefferson",18,5,16,32),("Kristin","Sandoval",9,3,12,30),("Gillian","Barber",8,19,6,34),("Riley","Goodwin",16,15,5,37),("Dean","Brady",11,7,18,6),("Alani","Krause",9,15,6,11),("Monserrat","Walker",6,12,1,38),("Kira","Velazquez",1,2,15,15),("Kenna","Cruz",12,17,6,17),("Jaxon","Hood",20,18,4,27),("Aubrey","Irwin",11,7,6,2),("Luka","Morrow",15,15,20,32),("Nathanael","Wong",11,18,5,20),("Harold","Barrett",0,5,1,40),("Eduardo","Spears",16,2,4,4),("Brodie","Riggs",8,5,14,36),("Bailey","Owens",7,15,10,23),("Riley","Browning",9,16,19,19),("Finn","Bass",7,19,16,0),("Alexa","Huang",12,7,16,4),("Mohammed","Reid",12,6,2,24),("Cohen","Parks",4,1,17,9),("Jermaine","Shields",7,11,13,9),("Rohan","Cannon",11,20,18,7),("Tyree","Montgomery",18,5,17,31),("Yadiel","Sloan",0,9,20,38),("Mckenzie","Cunningham",15,4,17,25),("Jair","Tucker",19,3,14,3),("Giovani","Liu",3,16,15,19),("Leila","Barajas",7,15,1,37),("Alden","Peters",14,7,10,16),("Anika","Bush",11,15,19,22),("Keira","Moreno",13,7,8,3),("Erick","Hopkins",13,15,7,0),("Dereon","Bullock",12,17,3,32),("Charity","Mcknight",9,20,6,19),("Amari","Singh",16,10,7,40),("Guillermo","Mack",4,2,0,8),("Uriah","George",20,20,5,29),("Natalya","Case",20,13,17,25),("Frida","Burke",9,15,10,15),("Edgar","Lester",17,2,19,14)]
    
    fromTuple :: (String, String, Integer, Integer, Integer, Integer) -> Student
    fromTuple (f, l, p, a1, a2, e) = Student f l p a1 a2 e
    
    data Student = Student {
        firstName::String,
        lastName::String,
        participation::Integer,
        assignment1::Integer,
        assignment2::Integer,
        exam::Integer
    } deriving (Show, Eq)
    
    perfectStudent = Student "Smarty" "Pants" 20 20 20 40
    examMax = exam perfectStudent
    nonExamMax = participation perfectStudent + assignment1 perfectStudent + assignment2 perfectStudent
    
    instance Ord Student where
        compare a b = undefined
    
    students :: [Student]
    students = map fromTuple rawStudents
    
    percent :: Integer -> Integer -> Float
    percent mark maxMark = 100 * (fromInteger mark / fromInteger maxMark)
    
    ranked :: [Student]
    ranked = reverse $ sort students
    
    test = if
        map (head . firstName) ranked == "MWLLJGLNUHARTIYBLJZYSAGJTJAAADBKKHRDMGLBDATSBCDNCKCGKHMZJLMORLKLHBMEMFRAAAANLHNMDDDFALTAIJJMMJAMXACEZKPSAECKFMEACLIPLGTM"
      then 
        "Your ordering is correct!"
      else
        "Keep trying!"