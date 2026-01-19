from pydantic import BaseModel,Field,computed_field,field_validator
from typing import Optional , Annotated,Literal

# Models Pydantic Class **

tier_1_cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"]
tier_2_cities = [
    "Jaipur", "Chandigarh", "Indore", "Lucknow", "Patna", "Ranchi", "Visakhapatnam", "Coimbatore",
    "Bhopal", "Nagpur", "Vadodara", "Surat", "Rajkot", "Jodhpur", "Raipur", "Amritsar", "Varanasi",
    "Agra", "Dehradun", "Mysore", "Jabalpur", "Guwahati", "Thiruvananthapuram", "Ludhiana", "Nashik",
    "Allahabad", "Udaipur", "Aurangabad", "Hubli", "Belgaum", "Salem", "Vijayawada", "Tiruchirappalli",
    "Bhavnagar", "Gwalior", "Dhanbad", "Bareilly", "Aligarh", "Gaya", "Kozhikode", "Warangal",
    "Kolhapur", "Bilaspur", "Jalandhar", "Noida", "Guntur", "Asansol", "Siliguri"
]


## pydantic model to validate the input fields 
class userInput(BaseModel):
    age:Annotated[int,Field(...,gt=0 , lt=120 ,description="Age of the user")]
    weight:Annotated[float,Field(...,gt=0,description="weight of the user")]
    height:Annotated[float,Field(...,gt=0,lt=2.5,description="height of the user")]
    income_lpa:Annotated[float,Field(...,gt=0,description="Income of the user")]
    smoker:Annotated[bool,Field(...,description="Is user a smoker")]
    city:Annotated[str,Field(...,description="City that user belongs to ")]
    occupation:Annotated[Literal['retired', 'freelancer', 'student', 'government_job',
       'business_owner', 'unemployed', 'private_job'],Field(...,description="Occupation of the User")]

    
    @field_validator('city')
    def normalize_city(cls,city:str)->str:
        city = city.strip().title()
        return city

    @computed_field
    @property
    def BMI(self)->float:
        bmi =self.weight/(self.height)**2
        return bmi
     
    @computed_field
    @property
    def lifeStyle_risk(self)->str:
        if self.smoker and self.BMI > 30:
            return "high"
        elif self.smoker and self.BMI < 27:
            return "medium"
        else:
            return "low"
        
    @computed_field
    @property
    def age_group(self)->str:
        if self.age < 25:
            return "young"
        elif self.age < 45:
            return "adult"
        elif self.age < 60:
            return "middle_aged"
        return "senior"
    
    @computed_field
    @property
    def city_tier(self)->int:
        if self.city in tier_1_cities:
            return 1
        elif self.city in tier_2_cities:
            return 2
        else:
            return 3