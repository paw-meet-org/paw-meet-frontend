/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CiudadBase } from '../models/CiudadBase';
import type { GlobalResponseSchema } from '../models/GlobalResponseSchema';
import type { PublicacionesBase } from '../models/PublicacionesBase';
import type { SponsorBase } from '../models/SponsorBase';
import type { TipoMascotaBase } from '../models/TipoMascotaBase';
import type { Usuario } from '../models/Usuario';
import type { UsuarioBase } from '../models/UsuarioBase';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdministradorService {
    /**
     * Registra un nuevo usuario en el sistema
     * Registra un nuevo usuario en el sistema dado los datos procedentes del cuerpo de la petición
     * @param requestBody
     * @returns GlobalResponseSchema Usuario insertado correctamente
     * @throws ApiError
     */
    public static registrarUsuario(
        requestBody: UsuarioBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Campos no validos`,
                401: `Autentificación fallida`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtiene todos los usuarios
     * Obtiene todos los usuarios registrados en el sistema
     * @returns Usuario Datos recuperados de forma exitosa
     * @throws ApiError
     */
    public static obtenerUsuarios(): CancelablePromise<Array<Usuario>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
            errors: {
                401: `Autentificación fallida`,
                404: `No se han encontrado usuarios registrados`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtiene el usuario seleccionado
     * Obtiene el usuario cuyo identificador coincide con el pasado por parámetros en la petición.
     * @param id Identificador de la entidad
     * @returns Usuario Usuario obtenido correctamente
     * @throws ApiError
     */
    public static obtenerUsuarioPoIdentificador(
        id: string,
    ): CancelablePromise<Usuario> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Parametro invalido`,
                401: `Autentificación fallida`,
                404: `Error al recuperar el usuario indicado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Actualiza informacion del usuario seleccionado
     * Actualiza información sobre el usario indicado por parámetros
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns GlobalResponseSchema Informacion de usuario actualizada correctamente
     * @throws ApiError
     */
    public static actualizarUsuario(
        id: string,
        requestBody: UsuarioBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cuerpo de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al actualizar un usuario`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Elimina información del usuario seleccionado
     * Elimina un usuario seleccionado del sistema
     * @param id Identificador de la entidad
     * @returns void
     * @throws ApiError
     */
    public static deleteUsuario(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al eliminar un usuario`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registra un nuevo sponsor en el sistema
     * Registra un nuevo sponsor en el sistema dado los datos procedentes del cuerpo de la petición
     * @param requestBody
     * @returns GlobalResponseSchema Sponsor insertado correctamente
     * @throws ApiError
     */
    public static registrarSponsor(
        requestBody: (SponsorBase & Record<string, any>),
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/sponsors',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Campos no validos`,
                401: `Autentificación fallida`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtiene todos los sponsors
     * Obtiene todos los sponsors registrados en el sistema
     * @returns SponsorBase Datos recuperados de forma exitosa
     * @throws ApiError
     */
    public static obtenerSponsors(): CancelablePromise<Array<SponsorBase>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/sponsors',
            errors: {
                401: `Autentificación fallida`,
                404: `No se han encontrado sponsors registrados`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtiene el sponsor seleccionado
     * Obtiene el sponsor cuyo identificador coincide con el pasado por parámetros en la petición.
     * @param id Identificador de la entidad
     * @returns SponsorBase Sponsor obtenido correctamente
     * @throws ApiError
     */
    public static obtenerSponsorPoIdentificador(
        id: string,
    ): CancelablePromise<SponsorBase> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/sponsors/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Parametro invalido`,
                401: `Autentificación fallida`,
                404: `Error al recuperar el sponsor indicado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Actualiza informacion del sponsor seleccionado
     * Actualiza información sobre el sponsor indicado por parámetros
     * @param id Identificador de la entidad
     * @param requestBody
     * @returns GlobalResponseSchema Informacion de sponsor actualizado correctamente
     * @throws ApiError
     */
    public static actualizarSponsor(
        id: string,
        requestBody: SponsorBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/sponsors/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cuerpo de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al actualizar un sponsor`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Elimina información del sponsor seleccionado
     * Elimina un sponsor seleccionado del sistema
     * @param id Identificador de la entidad
     * @returns void
     * @throws ApiError
     */
    public static deleteSponsor(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/sponsors/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al eliminar un usuario`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtiene todas las ciudades del sistema
     * Obtiene todas las ciudades registradas en el sistema
     * @returns CiudadBase Ciudades recuperadas exitosamente
     * @throws ApiError
     */
    public static obtenerCiudades(): CancelablePromise<Array<CiudadBase>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/ciudad',
            errors: {
                401: `Autentificación fallida`,
                404: `Error al obtener datos de ciudades`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registra una nueva ciudad en el sistema
     * Dado los datos pasados en el cuerpo de la peticion, registra una nueva ciudad
     * @param requestBody
     * @returns GlobalResponseSchema Registrado una nueva ciudad en el sistema
     * @throws ApiError
     */
    public static registrarCiudad(
        requestBody: CiudadBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/ciudad',
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
     * Obtiene todos los tipos de mascota registrados en el sistema
     * Obtiene todos los tipos de mascota registrados en el sistema
     * @returns TipoMascotaBase Tipos de mascota recuperados exitosamente
     * @throws ApiError
     */
    public static obtenerTipoMascota(): CancelablePromise<Array<TipoMascotaBase>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/razas',
            errors: {
                401: `Autentificación fallida`,
                404: `Error al obtener datos de tipos de mascota`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registra un nuevo tipo de mascota en el sistema
     * Dado los datos pasados en el cuerpo de la peticion, registra un nuevo tipo de mascota
     * @param requestBody
     * @returns GlobalResponseSchema Registrado un nuevo tipo de mascota en el sistema
     * @throws ApiError
     */
    public static registrarTipoMascota(
        requestBody: TipoMascotaBase,
    ): CancelablePromise<GlobalResponseSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/razas',
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
     * Obtiene todas las publicaciones del sistema
     * Obtiene todas las publicaciones de todos los foros registrados en el sistema
     * @returns PublicacionesBase Se han recuperado correctamente todas las publicaciones
     * @throws ApiError
     */
    public static moderarPublicaciones(): CancelablePromise<Array<PublicacionesBase>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/moderacion',
            errors: {
                401: `Autentificación fallida`,
                404: `Publicaciones no registradas en el sistema`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Elimina la publicación indicada por parámetros
     * Elimina la publicación indicada por parámetros path de la petición
     * @param user
     * @param id Identificador de la entidad
     * @returns void
     * @throws ApiError
     */
    public static moderacionDeletePublicacion(
        user: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/moderacion/{id}',
            path: {
                'id': id,
            },
            query: {
                'user': user,
            },
            errors: {
                400: `Parámetros de la petición invalido`,
                401: `Autentificación fallida`,
                404: `Error al eliminar una publicacion`,
                500: `Error interno del servidor`,
            },
        });
    }
}
