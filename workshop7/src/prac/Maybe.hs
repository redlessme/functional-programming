phonebook::[(String,String)]
phonebook=[("bob","012345"),("meiya","19882317")]

printNumber name =msg $lookup name phonebook
    where 
        msg(Just number)=print number
        msg Nothing = print$ name++" not found in database"
