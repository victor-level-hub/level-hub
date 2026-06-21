"""
LEVEL - Capturador via PS Remote Play (Call of Duty: Black Ops 7)
====================================================================
Faixa fina sempre no topo. Fluxo:
  - Joga o BO7 por PS Remote Play no PC e abre o Gunsmith de uma arma.
  - Aperta PLAY: a cada 8 segundos o capturador tira UM print da tela e ENVIA
    direto pro LEVEL (nosso dominio na nuvem). NADA e salvo no seu PC.
  - Voce vai trocando a tela (proxima arma) a cada contagem.
  - No LEVEL, a IA le a arma do print e cria a build sozinha; a foto e apagada
    depois de lida.
  - FINAL/ABORT param o loop. Esc/X fecham.

Na 1a vez ele pede o seu ID do LEVEL (aparece no hub em
"Minhas Armas -> Adicionar via PS Remote Play"). Cola uma vez e pronto.

Requisitos: Windows + Python 3. Duplo-clique para rodar.
So usa biblioteca padrao (tkinter, urllib, subprocess) - sem instalar nada.
"""
import tkinter as tk
from tkinter import simpledialog
import os, json, time, subprocess, tempfile, urllib.request

# ---- Config do LEVEL (nao precisa mexer) ----
INGEST_URL = "https://cqkhqtgmolmrfgzozocr.supabase.co/functions/v1/share-ingest"
ANON = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6"
        "ImNxa2hxdGdtb2xtcmZnem96b2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTEwODksImV4"
        "cCI6MjA5MzcyNzA4OX0.ets0bgps9n5F4orIAd96iY6bj9R5VgumtgNCm-ui-ck")
PASTA = os.path.dirname(os.path.abspath(__file__))
CFG = os.path.join(PASTA, "level_config.json")
SEGUNDOS = 8

BG = "#141a2b"
AMBER = "#FF9800"
AMBER2 = "#FFB84D"
GREEN = "#4ADE80"
RED = "#E74C3C"
TASKBAR = 48


def load_local_id():
    try:
        with open(CFG, "r", encoding="utf-8") as f:
            return (json.load(f) or {}).get("local_id") or ""
    except Exception:
        return ""


def save_local_id(val):
    try:
        with open(CFG, "w", encoding="utf-8") as f:
            json.dump({"local_id": val}, f)
    except Exception:
        pass


def grab_temp():
    """Captura a tela inteira via PowerShell/.NET para um PNG temporario. Retorna o caminho."""
    fd, path = tempfile.mkstemp(suffix=".png", prefix="level_cap_")
    os.close(fd)
    ps = (
        "Add-Type -AssemblyName System.Windows.Forms;"
        "Add-Type -AssemblyName System.Drawing;"
        "$vs=[System.Windows.Forms.SystemInformation]::VirtualScreen;"
        "$bmp=New-Object System.Drawing.Bitmap $vs.Width,$vs.Height;"
        "$g=[System.Drawing.Graphics]::FromImage($bmp);"
        "$g.CopyFromScreen($vs.Left,$vs.Top,0,0,$bmp.Size);"
        "$bmp.Save('" + path + "');"
        "$g.Dispose();$bmp.Dispose()"
    )
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-WindowStyle", "Hidden", "-Command", ps],
            creationflags=0x08000000, timeout=15,
        )
    except Exception:
        pass
    return path


def upload(png_bytes, local_id):
    """Envia o PNG pro LEVEL (share-ingest, modo RAW). Retorna True se ok."""
    req = urllib.request.Request(INGEST_URL, data=png_bytes, method="POST")
    req.add_header("Content-Type", "image/png")
    req.add_header("x-mime", "image/png")
    req.add_header("x-local-id", local_id)
    req.add_header("x-kind", "weapon")
    req.add_header("apikey", ANON)
    req.add_header("Authorization", "Bearer " + ANON)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return 200 <= r.status < 300
    except Exception:
        return False


root = tk.Tk()
root.overrideredirect(True)
root.attributes("-topmost", True)
root.attributes("-alpha", 0.95)
root.configure(bg=BG)
sw = root.winfo_screenwidth()
sh = root.winfo_screenheight()
W, H = 520, TASKBAR
root.geometry(f"{W}x{H}+6+{sh - TASKBAR}")

state = {"on": False, "count": 0, "sent": 0, "local_id": load_local_id()}


def ensure_local_id():
    if state["local_id"]:
        return True
    val = simpledialog.askstring(
        "LEVEL",
        "Cole aqui o seu ID do LEVEL\n(hub -> Minhas Armas -> Adicionar via PS Remote Play):",
        parent=root,
    )
    val = (val or "").strip()
    if val:
        state["local_id"] = val
        save_local_id(val)
        return True
    return False


def do_capture():
    state["count"] += 1
    n = state["count"]
    root.withdraw()
    root.update()
    time.sleep(0.12)
    path = grab_temp()
    root.deiconify()
    ok = False
    try:
        with open(path, "rb") as f:
            data = f.read()
        ok = upload(data, state["local_id"])
    except Exception:
        ok = False
    finally:
        try:
            os.remove(path)
        except Exception:
            pass
    if ok:
        state["sent"] += 1
        label.config(text=f"enviado {state['sent']}  (foto {n})", fg=GREEN)
    else:
        label.config(text=f"falha ao enviar a foto {n} - verifique a internet", fg=RED)


def step(i):
    if not state["on"]:
        return
    if i < SEGUNDOS:
        label.config(text=f"{SEGUNDOS - i}   -> troque a tela do Gunsmith", fg=AMBER2)
        root.after(1000, lambda: step(i + 1))
    else:
        label.config(text="enviando...", fg=GREEN)
        root.after(150, shoot)


def shoot():
    if not state["on"]:
        return
    do_capture()
    root.after(900, lambda: step(0))


btns = tk.Frame(root, bg=BG)
btns.pack(side="right", fill="y", padx=4)


def do_play():
    if state["on"]:
        return
    if not ensure_local_id():
        label.config(text="precisa do seu ID do LEVEL para enviar", fg=RED)
        return
    state["count"] = 0
    state["sent"] = 0
    state["on"] = True
    step(0)


def do_done():
    state["on"] = False
    label.config(text=f"FINALIZADO - {state['sent']} fotos enviadas", fg=GREEN)


def do_stop():
    state["on"] = False
    label.config(text="ABORTADO", fg=RED)


def do_close():
    state["on"] = False
    root.destroy()


def mkbtn(txt, fg, bg, ab, cmd):
    tk.Button(btns, text=txt, font=("Segoe UI", 13, "bold"), fg=fg, bg=bg,
              activebackground=ab, bd=0, width=2, command=cmd,
              cursor="hand2").pack(side="left", padx=2, pady=6, fill="y")


mkbtn("▶", "#0a0a0a", GREEN, "#15c25c", do_play)
mkbtn("✔", "#0a0a0a", "#2fd0c8", "#28b3ac", do_done)
mkbtn("■", "#ffffff", RED, "#d63b3b", do_stop)
mkbtn("✕", "#ffffff", "#3a3a42", "#55555f", do_close)
root.bind("<Escape>", lambda e: do_close())

label = tk.Label(root, text="LEVEL - pronto. PLAY para capturar e enviar",
                 font=("Segoe UI", 14, "bold"), fg=AMBER, bg=BG, anchor="w")
label.pack(side="left", expand=True, fill="both", padx=8)


def start_move(e):
    root._dx, root._dy = e.x, e.y


def do_move(e):
    root.geometry(f"+{root.winfo_x() + e.x - root._dx}+{root.winfo_y() + e.y - root._dy}")


label.bind("<Button-1>", start_move)
label.bind("<B1-Motion>", do_move)


def keep_on_top():
    try:
        root.attributes("-topmost", True)
        root.lift()
    except Exception:
        pass
    root.after(400, keep_on_top)


keep_on_top()
root.mainloop()
