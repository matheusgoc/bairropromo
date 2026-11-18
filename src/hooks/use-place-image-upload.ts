import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import PlaceModel from '@/models/place.model';
import PlaceService, {
  PlaceImageContentType,
  PlaceImageType,
} from '@/services/place.service';

interface Options {
  placeId: string;
  type: PlaceImageType;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

interface Result {
  pendingUri: string | null; // local URI shown optimistically while uploading
  isUploading: boolean;
  pick: () => Promise<void>; // the only function the view needs to call
}

interface UploadInput {
  uri: string;
  contentType: PlaceImageContentType;
}

const CONTENT_TYPES: Record<string, PlaceImageContentType> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

const SUPPORTED_CONTENT_TYPES = new Set<string>(Object.values(CONTENT_TYPES));

/**
 * The upload content type of a picked image: its MIME type when the API
 * supports it, otherwise inferred from the file extension.
 */
const toContentType = (
  asset: ImagePicker.ImagePickerAsset,
): PlaceImageContentType | null => {
  if (asset.mimeType && SUPPORTED_CONTENT_TYPES.has(asset.mimeType)) {
    return asset.mimeType as PlaceImageContentType;
  }
  const name = (asset.fileName ?? asset.uri).split('?')[0];
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  return CONTENT_TYPES[ext] ?? null;
};

const usePlaceImageUpload = ({
  placeId,
  type,
  onSuccess,
  onError,
}: Options): Result => {
  const queryClient = useQueryClient();
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ uri, contentType }: UploadInput) =>
      PlaceService.uploadImage(placeId, uri, type, contentType),
    onSuccess: (draftUrl) => {
      // The upload becomes the place's draft image until it's approved; update
      // the cache right away instead of waiting for a refetch round-trip.
      queryClient.setQueryData<PlaceModel>(['place', placeId], (old) => {
        if (!old) return old;
        return {
          ...old,
          [type === 'logo' ? 'draftLogo' : 'draftPhoto']: draftUrl,
        };
      });
      // The profile place list shows the draft logo too.
      queryClient.invalidateQueries({ queryKey: ['places'] });
      setPendingUri(null);
      onSuccess?.(draftUrl);
    },
    onError: (error: Error) => {
      setPendingUri(null); // revert optimistic image
      onError?.(error);
    },
  });

  const pick = useCallback(async () => {
    setLoading(true);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        onError?.(new Error('permission_denied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: type === 'logo' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (result.canceled) return; // silent — user dismissed picker

      const asset = result.assets[0];
      const contentType = toContentType(asset);
      if (!contentType) {
        onError?.(new Error('unsupported_type'));
        return;
      }

      setPendingUri(asset.uri); // optimistic: show selected image immediately
      mutate({ uri: asset.uri, contentType });
    } catch (e) {
      onError?.(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false); // also on cancel/denial, so the spinner never sticks
    }
  }, [type, mutate, onError]);

  return { pendingUri, isUploading: isPending || loading, pick };
};

export default usePlaceImageUpload;
