/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { GlobalResponseSchema } from '../models/GlobalResponseSchema';
import type { Login } from '../models/Login';
import type { Mascota } from '../models/Mascota';
import type { MascotasBase } from '../models/MascotasBase';
import type { Registro } from '../models/Registro';
import type { UpdateUser } from '../models/UpdateUser';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsuarioService {
    /**
     * Registro de usuario
     * Registra un usuario en el sistema.
     * @param requestBody
     * @returns GlobalResponseSchema Usuario registrado correctamente
     * @throws ApiError
     */
    public static registro(
        requestBody: Registro,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/registro',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Problemas con el cuerpo de la petición`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Login de usuario
     * Devuelve un token JWT para autenticación.
     * @param requestBody
     * @returns AuthResponse Login correcto
     * @throws ApiError
     */
    public static login(
        requestBody: Login,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Credenciales incorrectas`,
                404: `Usuario no registrado en el sistema`,
                500: `Error internos del servidor`,
            },
        });
    }
    /**
     * Actualizar perfil de usuario
     * Permite modificar datos del usuario autenticado.
     * @param requestBody
     * @returns GlobalResponseSchema Perfil actualizado correctamente
     * @throws ApiError
     */
    public static updateUser(
        requestBody: UpdateUser,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Campos incorrectos`,
                401: `Autentificación fallida`,
                404: `Usuario no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registrar mascota
     * Registra una mascota asociada al usuario autenticado.
     * @param requestBody
     * @returns GlobalResponseSchema Mascota registrada correctamente
     * @throws ApiError
     */
    public static registrarMascotas(
        requestBody: MascotasBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/mascota',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Campos incorrectos`,
                401: `Autentificación fallida`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener mascotas del usuario
     * Devuelve las mascotas del usuario autenticado.
     * @returns Mascota Lista de mascotas
     * @throws ApiError
     */
    public static getMascotas(): CancelablePromise<Array<Mascota>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/mascota',
            errors: {
                401: `Autentificación fallida`,
                404: `Usuario sin mascotas registradas`,
                500: `Error interno del servidor`,
            },
        });
    }
}
