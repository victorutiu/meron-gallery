const blends = [
{
id:1,
name:"Milky Blend",
quantity:"5000g",
author:"Ianis Ilea",
status:"Available",

coffees:[
{
coffeeId:1,
name:"Ethiopia Guji",
origin:"Ethiopia",
percentage:40
},
{
coffeeId:2,
name:"Columbia Carambolo",
origin:"Columbia",
percentage:25
},
{
coffeeId:3,
name:"Panama Duncan",
origin:"Panama",
percentage:10
},
{
coffeeId:4,
name:"Kenya Mugaya",
origin:"Kenya",
percentage:25
}
]
},

{
id:2,
name:"Breakfast Blend",
quantity:"2500g",
author:"George Chit",
status:"Available",

coffees:[
{
coffeeId:5,
name:"Kenya Mugaya",
origin:"Kenya",
percentage:50
},
{
coffeeId:1,
name:"Ethiopia Guji",
origin:"Ethiopia",
percentage:50
}
]
},

{
id:3,
name:"House Blend",
quantity:"1000g",
author:"Ianis Ilea",
status:"Available",

coffees:[
{
coffeeId:3,
name:"Panama Duncan",
origin:"Panama",
percentage:60
},
{
coffeeId:7,
name:"Brazil Santos",
origin:"Brazil",
percentage:40
}
]
}
]

export default blends