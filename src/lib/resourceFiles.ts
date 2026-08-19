import { supabase } from './supabase';

export const LEARNING_RESOURCES_BUCKET = 'learning-resources';
export const MAX_PDF_SIZE_BYTES = 20 * 1024 * 1024;

const blockedResourceHosts = new Set([
  'example.com',
  'www.example.com',
  'w3.org',
  'www.w3.org',
  'localhost',
]);

export function isSafeLocalPdfUrl(value: string) {
  const href = value.trim();
  if (!href.startsWith('/resources/') || href.startsWith('//')) return false;

  try {
    const url = new URL(href, 'https://eduaihub.local');
    const decodedPath = decodeURIComponent(url.pathname);
    return decodedPath.startsWith('/resources/')
      && !decodedPath.split('/').includes('..')
      && decodedPath.toLowerCase().endsWith('.pdf');
  } catch {
    return false;
  }
}

export function getSafeResourceUrl(resource: {
  external_url?: string | null;
  file_url?: string | null;
}) {
  const href = resource.external_url?.trim() || resource.file_url?.trim();
  if (!href) return null;

  if (isSafeLocalPdfUrl(href)) return href;

  try {
    const url = new URL(href);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (blockedResourceHosts.has(url.hostname.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateResourceUrl(value: string) {
  const href = value.trim();
  if (!href) return 'Hãy nhập URL tài nguyên hoặc chọn tải PDF lên.';

  if (href.startsWith('/')) {
    if (!isSafeLocalPdfUrl(href)) {
      return 'URL local phải có dạng /resources/ten-file.pdf và không được chứa đường dẫn không an toàn.';
    }
    return null;
  }

  try {
    const url = new URL(href);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Chỉ chấp nhận URL bắt đầu bằng https://, http:// hoặc /resources/*.pdf.';
    }
    if (blockedResourceHosts.has(url.hostname.toLowerCase())) {
      return 'URL mẫu hoặc địa chỉ nội bộ không được dùng làm tài nguyên.';
    }
    return null;
  } catch {
    return 'URL tài nguyên không hợp lệ.';
  }
}

export async function validatePdfFile(file: File) {
  if (file.type !== 'application/pdf') {
    return 'Chỉ chấp nhận file PDF có MIME type application/pdf.';
  }
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return 'Tên file phải có phần mở rộng .pdf.';
  }
  if (file.size <= 0) return 'File PDF đang trống.';
  if (file.size > MAX_PDF_SIZE_BYTES) return 'File PDF không được vượt quá 20 MB.';

  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const hasPdfSignature = header.length === 5
    && header[0] === 0x25
    && header[1] === 0x50
    && header[2] === 0x44
    && header[3] === 0x46
    && header[4] === 0x2d;

  return hasPdfSignature ? null : 'File không có chữ ký PDF hợp lệ (%PDF-).';
}

function safePdfBaseName(fileName: string) {
  const withoutExtension = fileName.replace(/\.pdf$/i, '');
  const normalized = withoutExtension
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return normalized || 'tai-lieu';
}

export async function uploadLearningResourcePdf(file: File, userId: string) {
  const validationError = await validatePdfFile(file);
  if (validationError) throw new Error(validationError);

  const safeUserId = userId.replace(/[^a-z0-9-]/gi, '');
  if (!safeUserId) throw new Error('Không xác định được tài khoản tải file.');

  const path = `resources/${safeUserId}/${crypto.randomUUID()}-${safePdfBaseName(file.name)}.pdf`;
  const { error } = await supabase.storage
    .from(LEARNING_RESOURCES_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(LEARNING_RESOURCES_BUCKET).getPublicUrl(path);
  if (!data.publicUrl) {
    await supabase.storage.from(LEARNING_RESOURCES_BUCKET).remove([path]);
    throw new Error('Không tạo được URL công khai cho tài liệu.');
  }

  return { path, publicUrl: data.publicUrl };
}

export async function removeLearningResourcePdf(path: string) {
  await supabase.storage.from(LEARNING_RESOURCES_BUCKET).remove([path]);
}
