import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import database from './database'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-jwt-key-change-this'

export interface User {
  id: number
  email: string
  credits: number
  total_generated: number
  created_at: string
  last_login: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

// Şifre hash'leme
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Şifre doğrulama
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// JWT token oluşturma
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' })
}

// JWT token doğrulama
export function verifyToken(token: string): { userId: number } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number }
    return payload
  } catch (error) {
    return null
  }
}

// Kullanıcı kaydı
export async function registerUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Geçersiz email formatı' }
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return { success: false, error: 'Şifre en az 6 karakter olmalı' }
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await database.getUserByEmail(email)
    if (existingUser) {
      return { success: false, error: 'Bu email zaten kayıtlı' }
    }

    // Şifreyi hash'le ve kullanıcıyı oluştur
    const passwordHash = await hashPassword(password)
    const result = await database.createUser(email, passwordHash)
    
    // Yeni kullanıcıyı getir
    const user = await database.getUserById(result.id)
    if (!user) {
      return { success: false, error: 'Kullanıcı oluşturulamıyor' }
    }
    
    const token = generateToken(user.id)

    // Hassas verileri kaldır
    const { password_hash, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token
    }
  } catch (error: any) {
    console.error('Register error:', error)
    return { success: false, error: 'Kayıt işlemi başarısız' }
  }
}

// Kullanıcı girişi
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Kullanıcıyı bul
    const user = await database.getUserByEmail(email)
    if (!user) {
      return { success: false, error: 'Email veya şifre hatalı' }
    }

    // Şifreyi kontrol et
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: 'Email veya şifre hatalı' }
    }

    // Son giriş zamanını güncelle
    await database.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id])

    const token = generateToken(user.id)

    // Hassas verileri kaldır
    const { password_hash, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return { success: false, error: 'Giriş işlemi başarısız' }
  }
}

// Request'ten kullanıcı bilgisini al
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth-token')?.value
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken
    
    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await database.getUserById(payload.userId)
    if (!user) {
      return null
    }

    // Hassas verileri kaldır
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('Get user from request error:', error)
    return null
  }
}

// Kullanıcının kredi kontrolü
export async function checkUserCredits(userId: number): Promise<number> {
  const user = await database.getUserById(userId)
  return user ? user.credits : 0
}

// Kredi kullanımı
export async function useUserCredit(userId: number, prompt: string): Promise<boolean> {
  try {
    const user = await database.getUserById(userId)
    if (!user || user.credits < 1) {
      return false
    }

    await database.useCredit(userId, prompt)
    return true
  } catch (error) {
    console.error('Use credit error:', error)
    return false
  }
}
