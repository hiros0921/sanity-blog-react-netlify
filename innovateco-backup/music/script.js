class MusicPlayer {
    constructor() {
        this.audioContext = null;
        this.currentSource = null;
        this.gainNode = null;
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.startTime = 0;
        this.pauseTime = 0;
        
        this.initializeElements();
        this.initializeEventListeners();
    }
    
    initializeElements() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.volumeBar = document.getElementById('volumeBar');
        this.volumeValue = document.getElementById('volumeValue');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        this.playlistItems = document.getElementById('playlistItems');
        this.generateBtn = document.getElementById('generateAudioBtn');
    }
    
    initializeEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        this.volumeBar.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.generateBtn.addEventListener('click', () => this.generateSampleAudio());
        
        this.playlistItems.addEventListener('click', (e) => {
            const item = e.target.closest('.playlist-item');
            if (item) {
                const trackIndex = parseInt(item.dataset.track);
                this.loadTrack(trackIndex);
            }
        });
    }
    
    async initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.7;
        }
    }
    
    generateSampleAudio() {
        this.initAudioContext().then(() => {
            this.tracks = [
                this.generatePianoTrack(),
                this.generateSynthTrack(),
                this.generateDrumTrack()
            ];
            
            this.loadTrack(0);
            this.generateBtn.textContent = 'サンプル音源生成完了！';
            this.generateBtn.disabled = true;
        });
    }
    
    generatePianoTrack() {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 30;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
            
            for (let i = 0; i < data.length; i++) {
                const time = i / sampleRate;
                const noteIndex = Math.floor(time * 2) % notes.length;
                const frequency = notes[noteIndex];
                
                let sample = 0;
                sample += 0.5 * Math.sin(2 * Math.PI * frequency * time);
                sample += 0.3 * Math.sin(2 * Math.PI * frequency * 2 * time);
                sample += 0.2 * Math.sin(2 * Math.PI * frequency * 3 * time);
                
                const envelope = Math.exp(-time * 0.5) * (1 - time / duration);
                data[i] = sample * envelope * 0.3;
            }
        }
        
        return {
            buffer: buffer,
            name: 'サンプル音源 1 - ピアノ',
            artist: '自動生成',
            duration: duration
        };
    }
    
    generateSynthTrack() {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 25;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < data.length; i++) {
                const time = i / sampleRate;
                const lfo = Math.sin(2 * Math.PI * 0.5 * time);
                const frequency = 220 + lfo * 50;
                
                let sample = 0;
                sample += 0.3 * Math.sin(2 * Math.PI * frequency * time);
                sample += 0.3 * (Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1);
                
                const filter = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.25 * time);
                sample *= filter;
                
                const envelope = 0.8 * (1 - time / duration);
                data[i] = sample * envelope * 0.3;
            }
        }
        
        return {
            buffer: buffer,
            name: 'サンプル音源 2 - シンセ',
            artist: '自動生成',
            duration: duration
        };
    }
    
    generateDrumTrack() {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 20;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < data.length; i++) {
                const time = i / sampleRate;
                const beat = time * 4;
                
                let sample = 0;
                
                if (beat % 1 < 0.05) {
                    sample += Math.random() * 2 - 1;
                    sample *= Math.exp(-(beat % 1) * 100);
                }
                
                if ((beat + 0.5) % 2 < 0.05) {
                    sample += Math.sin(2 * Math.PI * 200 * time) * Math.exp(-(beat % 1) * 50);
                }
                
                data[i] = sample * 0.5;
            }
        }
        
        return {
            buffer: buffer,
            name: 'サンプル音源 3 - ドラム',
            artist: '自動生成',
            duration: duration
        };
    }
    
    loadTrack(index) {
        if (!this.tracks.length) {
            alert('先に「サンプル音源を生成」ボタンをクリックしてください。');
            return;
        }
        
        this.stop();
        this.currentTrackIndex = index;
        const track = this.tracks[index];
        
        this.trackTitle.textContent = track.name;
        this.trackArtist.textContent = track.artist;
        this.durationEl.textContent = this.formatTime(track.duration);
        
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        this.progressBar.value = 0;
        this.currentTimeEl.textContent = '0:00';
    }
    
    play() {
        if (!this.tracks.length || this.isPlaying) return;
        
        const track = this.tracks[this.currentTrackIndex];
        this.currentSource = this.audioContext.createBufferSource();
        this.currentSource.buffer = track.buffer;
        this.currentSource.connect(this.gainNode);
        
        const offset = this.pauseTime;
        this.currentSource.start(0, offset);
        this.startTime = this.audioContext.currentTime - offset;
        this.isPlaying = true;
        
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
        
        this.currentSource.onended = () => {
            if (this.isPlaying) {
                this.nextTrack();
            }
        };
        
        this.updateProgress();
    }
    
    pause() {
        if (!this.isPlaying) return;
        
        this.pauseTime = this.audioContext.currentTime - this.startTime;
        this.stop();
        
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
    }
    
    stop() {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource.disconnect();
            this.currentSource = null;
        }
        this.isPlaying = false;
        cancelAnimationFrame(this.animationFrame);
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    previousTrack() {
        const newIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    nextTrack() {
        const newIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }
    
    seek(value) {
        const track = this.tracks[this.currentTrackIndex];
        if (!track) return;
        
        const seekTime = (value / 100) * track.duration;
        this.pauseTime = seekTime;
        
        if (this.isPlaying) {
            this.stop();
            this.play();
        }
    }
    
    setVolume(value) {
        const volume = value / 100;
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
        this.volumeValue.textContent = `${value}%`;
    }
    
    updateProgress() {
        if (!this.isPlaying) return;
        
        const currentTime = this.audioContext.currentTime - this.startTime;
        const track = this.tracks[this.currentTrackIndex];
        const progress = (currentTime / track.duration) * 100;
        
        this.progressBar.value = Math.min(progress, 100);
        this.currentTimeEl.textContent = this.formatTime(currentTime);
        
        this.animationFrame = requestAnimationFrame(() => this.updateProgress());
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const player = new MusicPlayer();
});