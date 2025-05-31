import { NextResponse } from "next/server";
import { PrismaUserRepository } from "../../../../backend/infra/repositories/PrismaUserRepository";
import { DetailUserUseCase } from "../../../../backend/usecase/DetailUserUseCase";
import { HealthConditionSignupUseCase } from "../../../../backend/usecase/HealthConditionSignupUseCase";

const userRepository = new PrismaUserRepository();
const detailUserUseCase = new DetailUserUseCase(userRepository);
const healthConditionUseCase = new HealthConditionSignupUseCase(userRepository);

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    
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