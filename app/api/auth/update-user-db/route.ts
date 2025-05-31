import { SignupUseCase } from '@/backend/application/usecases/signup/SignupUsecase';
import { UserRepository } from '@/backend/domain/repositories/UsersRepository';

export async function POST(req: Request) {

try {
    const formData = await req.json();
    
    const detailUserUseCase = new SignupUseCase(
      new UserRepository(),
      new UserHealthRepository()
    );
    
    const savedUser = await detailUserUseCase.execute({
      email: formData.email,
      photo: formData.photo,
      name: formData.name,
      birthyear: formData.birthyear ? parseInt(formData.birthyear) : undefined,
      member_type: formData.member_type,
      hpid: formData.hpid,
    });

    const healthConditions = {
      pregnent: formData.pregnent,
      allergy: formData.allergy,
      hypertension: formData.hypertension,
      diabetes: formData.diabetes,
      heartDisease: formData.heartDisease,
      liverDisease: formData.liverDisease,
      kidneyDisease: formData.kidneyDisease,
    };

    const healthConditionUseCase = new HealthConditionSignupUseCase(new UserRepository());
    await healthConditionUseCase.execute(savedUser.id!, healthConditions);

    return NextResponse.json({ 
      success: true, 
      data: savedUser 
    });

  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: "Database update failed" }, 
      { status: 500 }
    );
  }

}

