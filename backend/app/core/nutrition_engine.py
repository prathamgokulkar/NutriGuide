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