import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import PlaceModel from '@/models/place.model';
import PlaceService, { PlaceImageType } from '@/services/place.service';

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
    mutationFn: (uri: string) => PlaceService.uploadImage(placeId, uri, type),
    onSuccess: (uploadedUrl) => {
      // Update query cache immediately — avoids a full refetch round-trip
      queryClient.setQueryData<PlaceModel>(['place', placeId], (old) => {
        if (!old) return old;
        return { ...old, [type === 'logo' ? 'logo' : 'photo']: uploadedUrl };
      });
      setPendingUri(null);
      onSuccess?.(uploadedUrl);
    },
    onError: (error: Error) => {
      setPendingUri(null); // revert optimistic image
      onError?.(error);
    },
  });

  const pick = useCallback(async () => {
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
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

    const uri = result.assets[0].uri;
    setPendingUri(uri); // optimistic: show selected image immediately
    setLoading(false);
    mutate(uri);
  }, [type, mutate, onError]);

  return { pendingUri, isUploading: isPending || loading, pick };
};

export default usePlaceImageUpload;
