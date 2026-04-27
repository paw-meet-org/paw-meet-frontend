/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AsistenciaBase } from '../models/AsistenciaBase';
import type { EncuentrosBase } from '../models/EncuentrosBase';
import type { GlobalResponseSchema } from '../models/GlobalResponseSchema';
import type { TemasBase } from '../models/TemasBase';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EncuentrosService {
    /**
     * Obtiene los encuetros registrados en el sistema
     * Muestra al usuario todos los encuentros registrados en el sistema
     * @returns EncuentrosBase Encuentros obtenidos correctamente
     * @throws ApiError
     */
    public static obtenerEncuentros(): CancelablePromise<Array<EncuentrosBase>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/encuentros',
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al obtener los encuentros del sistema`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registra un nuevo encuentro
     * Registra un nuevo encuentro en el sistema
     * @param requestBody
     * @returns GlobalResponseSchema Registrado un nuevo encuentro
     * @throws ApiError
     */
    public static registrarEncuentro(
        requestBody: EncuentrosBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/encuentros',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cuerpo de la peticion incorrecto`,
                401: `Autentificación fallida`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Actualiza informacion de un encuentro
     * Actualiza informacion de un encuentro indicado por parametros
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns GlobalResponseSchema Informacion de encuentro actualizada correctamente
     * @throws ApiError
     */
    public static actualizarEncuentro(
        id: string,
        requestBody: EncuentrosBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/encuentro/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cuerpo de la peticion incorrecto`,
                401: `Autentificación fallida`,
                404: `Error al obtener los encuentros del sistema`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Elimina un encuentro del sistema
     * Elimina el encuentro indicado en los parámetros de la petición
     * @param id Identificador de la entidad
     * @returns void
     * @throws ApiError
     */
    public static eliminarEncuentro(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/encuentro/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al eliminar una peticion asociada al foro`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Crea un foro asociado al encuentro
     * Dado el encuentro indicado en los parámetros de la petición, crea el foro asociado
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns GlobalResponseSchema Registrado el foro asociado al encuentro
     * @throws ApiError
     */
    public static registrarForoEncuentro(
        id: string,
        requestBody: TemasBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/encuentros/{id}/foro',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cuerpo de la peticion incorrecto`,
                401: `Autentificación fallida`,
                404: `Error al crear el foro asociado al encuentro`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener asistencia de un encuentro
     * @param id Identificador de la entidad
     * @returns AsistenciaBase Asistencia obtenida correctamente
     * @throws ApiError
     */
    public static getApiEncuentrosAsistencia(
        id: string,
    ): CancelablePromise<AsistenciaBase> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/encuentros/{id}/asistencia',
            path: {
                'id': id,
            },
            errors: {
                400: `Cuerpo de la peticion incorrecto`,
                401: `Autentificación fallida`,
                404: `Error al crear la asistencia asociada al encuentro`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Crear asistencia para un encuentro
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns AsistenciaBase Asistencia creada correctamente
     * @throws ApiError
     */
    public static postApiEncuentrosAsistencia(
        id: string,
        requestBody: AsistenciaBase,
    ): CancelablePromise<AsistenciaBase> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/encuentros/{id}/asistencia',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cuerpo de la peticion incorrecto`,
                401: `Autentificación fallida`,
                404: `Error al crear la asistencia asociada al encuentro`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Eliminar asistencia
     * @param id Identificador de la entidad
     * @returns void
     * @throws ApiError
     */
    public static deleteApiEncuentrosAsistencia(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/encuentros/{id}/asistencia',
            path: {
                'id': id,
            },
            errors: {
                400: `Cuerpo de la peticion incorrecto`,
                401: `Autentificación fallida`,
                404: `Error al crear la asistencia asociada al encuentro`,
                500: `Error interno del servidor`,
            },
        });
    }
}
