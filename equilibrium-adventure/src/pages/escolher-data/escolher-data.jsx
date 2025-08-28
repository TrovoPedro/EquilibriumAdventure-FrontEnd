import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "../escolher-data/escolher-data.css";

export default function EscolhaDataCard() {
  const [value, setValue] = React.useState(dayjs());
  const [hora, setHora] = React.useState("");

  const horarios = ["09:00 - 10:00", "10:30 - 11:30", "12:00 - 13:00"];

  const handleSave = () => {
    console.log("Data:", value.format("DD/MM/YYYY"), "Hora:", hora);
  };

  return (
    <div className="overlay">
      <Card className="card-escolha">
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" className="btn-fechar">
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" className="titulo">
            Adicione uma data que você esteja disponível:
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
          </LocalizationProvider>

          <Typography variant="h6" align="center" className="titulo">
            Adicione um horário que você esteja disponível:
          </Typography>

          <div className="select-wrapper">
            <Select
              displayEmpty
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="select-horario"
            >
              <MenuItem value="">
                <em>Escolher Horário</em>
              </MenuItem>
              {horarios.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="botoes">
            <Button variant="contained" className="btn-salvar" onClick={handleSave}>
              Salvar Data
            </Button>
            <Button variant="contained" className="btn-calendario">
              Ver Calendário
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
