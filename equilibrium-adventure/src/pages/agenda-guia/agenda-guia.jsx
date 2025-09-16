import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { LocalizationProvider, DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const datas = [
  { data: "2025-09-15", status: "disponivel", evento: "Trilha das Águas", horario: "08:00" },
  { data: "2025-09-16", status: "ocupado", evento: "Montanha Azul", horario: "14:00" },
  { data: "2025-09-18", status: "disponivel", evento: "Cachoeira", horario: "10:00" },
  { data: "2025-09-20", status: "ocupado", evento: "Rapel", horario: "16:00" },
];

export default function AgendaGuia() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const info = datas.find((d) => selectedDate.isSame(dayjs(d.data), "day"));
      setDetalhes(info || null);
    } else {
      setDetalhes(null);
    }
  }, [selectedDate]);

  return (
    <Card sx={{ maxWidth: 420, margin: "40px auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: "#2e5e46", fontWeight: 700 }}>
          Agenda do Guia
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 2, color: "#0C513F" }}>
          Selecione uma data para ver os detalhes
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DateCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            slots={{
              day: (props) => {
                const { day, selected, ...other } = props;
                const dataInfo = datas.find((d) => dayjs(d.data).isSame(day, "day"));
                const isDisponivel = dataInfo?.status === "disponivel";
                const baseColor = !dataInfo ? "#fff" : isDisponivel ? "#2e5e46" : "#bdbdbd";

                return (
                  <PickersDay
                    {...other}
                    day={day}
                    selected={selected}
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: baseColor,
                      color: !dataInfo ? "#222" : "#fff",
                      border: day.isSame(dayjs(), "day") ? "1px solid #2e5e46" : "none",
                      "&.Mui-selected": {
                        backgroundColor: baseColor,
                        color: "#fff",
                        boxShadow: dataInfo ? "0 0 0 2px #244c38" : "none",
                      },
                    }}
                  />
                );
              },
            }}
          />
        </LocalizationProvider>

        <Box mt={3} p={2} sx={{ background: "#f5f5f5", borderRadius: 2, minHeight: 80 }}>
          {detalhes ? (
            <>
              <Typography variant="h6" sx={{ color: "#2e5e46", fontWeight: 700 }}>
                {detalhes.evento}
              </Typography>
              <Typography variant="body1" sx={{ color: "#0C513F" }}>
                Horário: {detalhes.horario}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
                Status: {detalhes.status === "disponivel" ? "Disponível" : "Ocupado"}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum evento para esta data.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
