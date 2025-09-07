import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log all the received data
    console.log('=== DEBUG: Quiz Submission Data ===');
    console.log('Raw body:', JSON.stringify(body, null, 2));
    
    // Check required fields
    const requiredFields = [
      'currentGrade', 'enjoyedSubjects', 'strongestSkills', 'techComfort',
      'workPreference', 'excitingActivities', 'freeDayChoice', 'workStyle',
      'taskPreference', 'stressHandling', 'workEnvironment', 'careerPriorities',
      'locationFlexibility', 'careerDepth', 'tenYearVision', 'explorationOpenness'
    ];
    
    const presentFields: string[] = [];
    const missingFields: string[] = [];
    const fieldDetails: any = {};
    
    requiredFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
        presentFields.push(field);
        fieldDetails[field] = {
          value: body[field],
          type: typeof body[field],
          isArray: Array.isArray(body[field]),
          length: Array.isArray(body[field]) ? body[field].length : (typeof body[field] === 'string' ? body[field].length : 'N/A')
        };
      } else {
        missingFields.push(field);
      }
    });
    
    console.log('Present fields:', presentFields);
    console.log('Missing fields:', missingFields);
    console.log('Field details:', JSON.stringify(fieldDetails, null, 2));
    
    // Check array fields specifically
    const arrayFields = ['enjoyedSubjects', 'strongestSkills', 'excitingActivities', 'careerPriorities'];
    const arrayValidation: any = {};
    arrayFields.forEach(field => {
      arrayValidation[field] = {
        exists: body[field] !== undefined,
        isArray: Array.isArray(body[field]),
        length: Array.isArray(body[field]) ? body[field].length : 0,
        value: body[field]
      };
    });
    console.log('Array validation:', JSON.stringify(arrayValidation, null, 2));
    
    // Check number fields
    const numberFields = ['techComfort', 'locationFlexibility'];
    const numberValidation: any = {};
    numberFields.forEach(field => {
      const val = body[field];
      numberValidation[field] = {
        value: val,
        type: typeof val,
        isNumber: typeof val === 'number',
        isValid: !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 5,
        converted: Number(val)
      };
    });
    console.log('Number validation:', JSON.stringify(numberValidation, null, 2));
    
    return NextResponse.json({
      debug: 'success',
      totalFields: Object.keys(body).length,
      requiredFieldsPresent: presentFields.length,
      requiredFieldsMissing: missingFields.length,
      presentFields,
      missingFields,
      fieldDetails,
      arrayValidation,
      numberValidation
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      debug: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
