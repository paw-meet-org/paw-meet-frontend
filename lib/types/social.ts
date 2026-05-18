import type { MeetingDetail, PublicacionList, UserPublic } from "@/api";

export type ForoDetail = {
  id: number;
  titulo: string;
  tipo_foro: string;
  usuario: UserPublic;
  publicaciones: PublicacionList[];
  encuentro?: MeetingDetail | number | null;
  total_publicaciones?: number | string;
};

