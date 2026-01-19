from fastapi import APIRouter,HTTPException
import pickle
import pandas as pd 
from schemas import userInput
from fastapi.responses import JSONResponse

#importing ml model / Creating Ml model
with open("model.pkl" , "rb") as f:
    model = pickle.load(f) 

router = APIRouter(
    prefix="",
    tags=["model"]
)

#Predict end point 
@router.post("/predict")
def predict_premimum(data: userInput):
    class_labels = model.classes_.tolist()

    try:
        input_df=pd.DataFrame([{
        'income_lpa':data.income_lpa,  #input data in the dataframe
        'occupation':data.occupation,
        'age_group':data.age_group,
        'BMI':data.BMI,
        'lifeStyleRisk':data.lifeStyle_risk,
        'Tier_cities':data.city_tier
    }])
        # predicted class 
        prediction_class = model.predict(input_df)[0]
        # prediction = prediction.item() -- used at time when model return np value

        #Predicted probabilites for all classes
        probabilites = model.predict_proba(input_df)[0]
        confidence = max(probabilites)

        #Create mapping :{class_name:probability}
        class_probs = dict(zip(class_labels,map(lambda p :round(p,4),probabilites)))


        return JSONResponse(status_code=200 , content={"pridected_catagory":prediction_class,
                                                       "confidence":round(confidence,4),
                                                       "class_probabilities":class_probs
                                                       })
    
    except Exception as e :
        raise HTTPException(status_code=500,detail=f"{e}")


  