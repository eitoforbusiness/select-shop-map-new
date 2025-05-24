<?php

namespace App\Http\Controllers;

use App\Actions\Auth\LoginAction;
use App\Actions\Auth\RegisterAction;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * ユーザーログイン
     *
     * @param LoginRequest $request
     * @param LoginAction $action
     * @return JsonResponse
     */
    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $result = $action->execute($request->validated());
        return response()->json($result);
    }

    /**
     * ユーザー登録
     *
     * @param RegisterRequest $request
     * @param RegisterAction $action
     * @return JsonResponse
     */
    public function register(RegisterRequest $request, RegisterAction $action): JsonResponse
    {
        $result = $action->execute($request->validated());
        return response()->json($result);
    }

    /**
     * ログアウト
     *
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        /** @var User|null $user */
        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
        }
        return response()->json(['message' => 'ログアウトしました']);
    }
} 