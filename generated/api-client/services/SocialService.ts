/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForoBase } from '../models/ForoBase';
import type { GlobalResponseSchema } from '../models/GlobalResponseSchema';
import type { PublicacionesBase } from '../models/PublicacionesBase';
import type { TemasBase } from '../models/TemasBase';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SocialService {
    /**
     * Obtiene información de los foros creados
     * Obtiene información de los foros creados, junto con sus temas y publicaciones
     * @returns ForoBase Obtención de foros exitosa
     * @throws ApiError
     */
    public static obtenerForos(): CancelablePromise<ForoBase> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/foros',
            errors: {
                401: `Autentificación fallida`,
                404: `Error al obtener informacion de foros`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtiene los temas incluidos en un foro
     * Obtiene los temas registrados en un foro
     * @param id Identificador de la entidad
     * @returns TemasBase Temas asociados al foro obtenidos correctamente
     * @throws ApiError
     */
    public static obtenerTemasForo(
        id: string,
    ): CancelablePromise<TemasBase> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/foros/{id}/temas',
            path: {
                'id': id,
            },
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al obtener los temas del foro indicado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registro de temas asociados aun foro
     * Registra un nuevo tema sobre el foro indicado
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns GlobalResponseSchema Registrado un nuevo tema al foro indicado
     * @throws ApiError
     */
    public static registrarTemaForo(
        id: string,
        requestBody: TemasBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/social/foros/{id}/temas',
            path: {
                'id': id,
            },
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
     * Obtiene las publicaciones asociadas a un foro
     * Obtiene las publicaciones asociadas al foro indicado por parámetros
     * @param id Identificador de la entidad
     * @returns PublicacionesBase Publicaciones asociadas al foro obtenidas correctamente
     * @throws ApiError
     */
    public static obtenerPublicacion(
        id: string,
    ): CancelablePromise<Array<PublicacionesBase>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/foros/{id}/publicacion',
            path: {
                'id': id,
            },
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al obtener las publicaciones del foro indicado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registra una nueva publicacion sobre el foro
     * Registra una nueva publicacion sobre el foro indicado por parámetros
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns GlobalResponseSchema Registrado una nueva publicación al foro indicado
     * @throws ApiError
     */
    public static registrarPublicacion(
        id: string,
        requestBody: PublicacionesBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/social/foros/{id}/publicacion',
            path: {
                'id': id,
            },
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
     * Elimina una publicacion del foro
     * Elimina una publicacion sobre el foro indicado
     * @param id Identificador de la entidad
     * @returns void
     * @throws ApiError
     */
    public static eliminarPublicacion(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/social/foros/{id}/publicacion',
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
}
