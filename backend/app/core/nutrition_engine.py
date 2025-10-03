# Logic for BMR, TDEE, and macro calculations

def calculate_nutritional_needs(
        gender:str,
        weight_kg: float,
        height_cm: float,
        age: int,
        activity_level: str
) -> dict:
    
    if gender.lower() == 'male':
        bmr = 88.362 + (13.397 * weight_kg) + (4.799 * height_cm) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight_kg) + (3.098 * height_cm) - (4.330 * age)

    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }

    multiplier = activity_multipliers.get(activity_level, 1.2)

    tdee = bmr * multiplier
    
    return {
        "bmr": round(bmr),
        "tdee": round(tdee)
    }

# Calculate the macro split based on goals for daily intake
def calculate_macro_split(tdee: int, goal: str) ->dict:
    if goal == "weight_loss":
        percentages = {'protein': 0.40, 'carbs': 0.30, 'fats': 0.30}
    elif goal == 'muscle_gain':
        percentages = {'protein': 0.35, 'carbs': 0.40, 'fats': 0.25}
    else:
        percentages = {'protein': 0.30, 'carbs': 0.40, 'fats': 0.30}

    protein_calories = tdee * percentages['protein']
    carb_calories = tdee * percentages['carbs']
    fat_calories = tdee * percentages['fats']

    protein_grams = round(protein_calories/4)
    carb_grams = round(carb_calories / 4)
    fat_grams = round(fat_calories / 9)

    return{
        "protein_g": protein_grams,
        "carbs_g": carb_grams,
        "fats_g": fat_grams,
        "total_calories": tdee
    }