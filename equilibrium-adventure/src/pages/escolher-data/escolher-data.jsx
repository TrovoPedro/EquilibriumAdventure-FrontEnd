import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import updateLocale from "dayjs/plugin/updateLocale";
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
import { buscarDatasDisponiveis, agendarAnamnese } from "../../services/chamadasAPIAgenda";

dayjs.extend(updateLocale);
dayjs.updateLocale("pt-br", { weekStart: 1 });
dayjs.locale("pt-br");

export default function EscolhaDataCard({ onClose, fkAventureiro }) {
  const [value, setValue] = React.useState(null);
  const [hora, setHora] = React.useState("");
  const [datasDisponiveis, setDatasDisponiveis] = React.useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = React.useState([]);

  React.useEffect(() => {
    async function fetchDatas() {
      try {
        const datas = await buscarDatasDisponiveis();
        console.log("Datas do backend:", datas);
        setDatasDisponiveis(datas);
        if (datas.length > 0) setValue(dayjs(datas[0].dataDisponivel));
      } catch (err) {
        alert("Erro ao buscar datas disponíveis.");
      }
    }
    fetchDatas();
  }, []);

  React.useEffect(() => {
    if (value) {
      const horarios = ["09:00 - 10:00", "10:30 - 11:30", "12:00 - 13:00"];
      setHorariosDisponiveis(horarios);
    }
  }, [value]);

  const handleClose = () => onClose();

  const handleSave = async () => {
    if (!value || !hora) {
      alert("Selecione uma data e um horário!");
      return;
    }

    const dataSelecionada = datasDisponiveis.find(d =>
      dayjs(d.dataDisponivel).isSame(value, "day")
    );

    if (!dataSelecionada) {
      alert("Data não encontrada!");
      return;
    }

    try {
      await agendarAnamnese({
        dataId: dataSelecionada.idAgenda,
        aventureiroId: 1,
        horario: hora
      });

      alert("Agendamento realizado!");
      handleClose();
    } catch (err) {
      console.error("Erro ao agendar:", err);
      alert("Erro ao agendar: " + (err.response?.data || err.message));
    }
  };

  return (
    <div
      className="overlay"
      style={{ position: "fixed", zIndex: 2000, overflow: "visible" }}
      onClick={(e) => e.target.classList.contains("overlay") && handleClose()}
    >
      <Card className="card-escolha" style={{ position: "relative", zIndex: 2100 }}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" style={{ marginBottom: 8, color: "#226144" }}>
            Adicione uma data que você esteja disponível:
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DateCalendar
              value={value}
              onChange={setValue}
              dayOfWeekFormatter={day => day.format("ddd")}
              shouldDisableDate={date =>
                datasDisponiveis.length > 0
                  ? !datasDisponiveis.some(d => dayjs(d.dataDisponivel).isSame(date, "day"))
                  : true
              }
              sx={{
                "& .MuiPickersDay-root.Mui-selected, .MuiPickersDay-root.Mui-selected:hover": {
                  backgroundColor: "#226144",
                },
              }}
            />
          </LocalizationProvider>

          <Typography variant="h6" align="center" style={{ marginTop: 16, marginBottom: 8, color: "#226144" }}>
            Adicione um horário que você esteja disponível:
          </Typography>

          <Box mt={1} mb={2}>
            <Select
              fullWidth
              displayEmpty
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              MenuProps={{
                disablePortal: true,
                PaperProps: {
                  style: { zIndex: 9999, minWidth: 220 },
                },
              }}
            >
              <MenuItem value="">
                <em>Escolher Horário</em>
              </MenuItem>
              {horariosDisponiveis.map(h => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box display="flex" justifyContent="center" mt={2} gap={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#226144",
                color: "#fff",
                fontWeight: 300,
                fontSize: "0.8rem",
                borderRadius: "8px",
                padding: "12px 24px",
                minWidth: "140px",
                boxShadow: "0 2px 8px rgba(34,97,68,0.13)",
                "&:hover": {
                  backgroundColor: "#1a4d35"
                }
              }}
              onClick={handleSave}
            >
              Salvar Data
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#226144",
                color: "#fff",
                fontWeight: 300,
                fontSize: "0.8rem",
                borderRadius: "8px",
                padding: "12px 24px",
                minWidth: "140px",
                boxShadow: "0 2px 8px rgba(34,97,68,0.13)",
                "&:hover": {
                  backgroundColor: "#1a4d35"
                }
              }}
              onClick={handleSave}
            >
              Ver calendário
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
