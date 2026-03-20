<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AudioUploadController extends Controller
{
    /**
     * Upload audio preview for a book
     */
    public function uploadPreview(Request $request, $bookId)
    {
        $validator = Validator::make($request->all(), [
            'audio' => 'required|file|mimes:mp3,wav,m4a|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = Book::find($bookId);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        // Vérifier que l'utilisateur est le vendeur du livre
        if ($book->seller_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $file = $request->file('audio');
            $filename = 'book_' . $bookId . '_preview_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Stocker le fichier dans storage/app/public/audio/previews
            $path = $file->storeAs('audio/previews', $filename, 'public');
            
            // Obtenir la durée du fichier audio
            $duration = $this->getAudioDuration($file);

            // Supprimer l'ancien fichier s'il existe
            if ($book->audio_preview) {
                $oldPath = str_replace('/storage/', '', $book->audio_preview);
                Storage::disk('public')->delete($oldPath);
            }

            // Mettre à jour le livre
            $book->audio_preview = '/storage/' . $path;
            $book->audio_duration = $duration;
            $book->save();

            return response()->json([
                'message' => 'Audio preview uploaded successfully',
                'audio_preview' => $book->audio_preview,
                'audio_duration' => $duration,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload audio: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete audio preview from a book
     */
    public function deletePreview($bookId)
    {
        $book = Book::find($bookId);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        // Vérifier que l'utilisateur est le vendeur du livre
        if ($book->seller_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            // Supprimer le fichier physique
            if ($book->audio_preview) {
                $path = str_replace('/storage/', '', $book->audio_preview);
                Storage::disk('public')->delete($path);
            }

            // Mettre à jour le livre
            $book->audio_preview = null;
            $book->audio_duration = null;
            $book->save();

            return response()->json(['message' => 'Audio preview deleted successfully']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete audio: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get audio duration usinggetID3 library or fallback
     */
    private function getAudioDuration($file)
    {
        try {
            // Pour l'instant, on utilise une estimation basique
            // Dans un projet réel, vous pourriez utiliser getID3 ou ffmpeg
            $filePath = $file->getPathname();
            
            // Estimation basique (vous pouvez améliorer cela avec une vraie bibliothèque)
            $fileSize = $file->getSize();
            $bitrate = 128; // Estimation 128 kbps pour MP3
            $duration = round(($fileSize * 8) / ($bitrate * 1000)); // en secondes
            
            return $duration;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Record audio directly (alternative method)
     */
    public function recordPreview(Request $request, $bookId)
    {
        $validator = Validator::make($request->all(), [
            'audio_data' => 'required|string', // Base64 encoded audio
            'duration' => 'required|integer|min:1|max:120', // Max 2 minutes
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = Book::find($bookId);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        if ($book->seller_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            $audioData = $request->input('audio_data');
            $duration = $request->input('duration');
            
            // Décoder les données base64
            $audioBinary = base64_decode($audioData);
            $filename = 'book_' . $bookId . '_preview_' . time() . '.webm';
            
            // Stocker le fichier
            $path = 'audio/previews/' . $filename;
            Storage::disk('public')->put($path, $audioBinary);

            // Supprimer l'ancien fichier s'il existe
            if ($book->audio_preview) {
                $oldPath = str_replace('/storage/', '', $book->audio_preview);
                Storage::disk('public')->delete($oldPath);
            }

            // Mettre à jour le livre
            $book->audio_preview = '/storage/' . $path;
            $book->audio_duration = $duration;
            $book->save();

            return response()->json([
                'message' => 'Audio preview recorded successfully',
                'audio_preview' => $book->audio_preview,
                'audio_duration' => $duration,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save audio: ' . $e->getMessage()], 500);
        }
    }
}
