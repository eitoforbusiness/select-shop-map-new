<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginAction
{
    /**
     * ログイン処理を実行
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     * @throws ValidationException
     */
    public function execute(array $data): array
    {
        if (!Auth::attempt($data)) {
            throw ValidationException::withMessages([
                'email' => ['メールアドレスまたはパスワードが正しくありません'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();
        
        // 既存のトークンを削除
        $user->tokens()->delete();
        
        // 新しいトークンを生成（24時間の有効期限）
        $token = $user->createToken('auth-token', ['*'], now()->addHours(24))->plainTextToken;

        return [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'expires_at' => now()->addHours(24)->toIso8601String(),
        ];
    }
} 