"use client";
import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

type Rec = { _id: string; title: string; description: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ email: string; name?: string; avatarUrl?: string } | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [reco, setReco] = useState<Rec[]>([]);

  useEffect(() => {
    (async () => {
      const p = await fetch("/api/profile").then((r) => r.json());
      setProfile(p.profile);
      setName(p.profile?.name || "");
      setAvatarUrl(p.profile?.avatarUrl || "");
      const rec = await fetch("/api/recommendations").then((r) => r.json());
      setReco(rec.items || []);
    })();
  }, []);

  const save = async () => {
    await fetch("/api/profile", { method: "PUT", body: JSON.stringify({ name, avatarUrl }) });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5">My Profile</Typography>
      {profile && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Email" value={profile.email} disabled />
              <TextField label="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <TextField label="Avatar URL" value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)} />
              <Box>
                <Button variant="contained" onClick={save}>Save</Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Pathfinder Recommendations</Typography>
          <Stack>
            {reco.map((r) => (
              <Box key={r._id}>
                <Typography variant="subtitle2">{r.title}</Typography>
                <Typography variant="body2" color="text.secondary">{r.description}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
