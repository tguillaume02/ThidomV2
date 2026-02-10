import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScenarioService } from '@core/services/scenario.service';
import { Scenario } from '@core/models/models';
import { ScenarioEditorComponent } from './scenario-editor/scenario-editor.component';

@Component({
  selector: 'app-scenarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './scenarios.component.html',
  styleUrl: './scenarios.component.scss',
})
export class ScenariosComponent implements OnInit {
  scenarios: Scenario[] = [];
  loading = true;

  constructor(
    private scenarioService: ScenarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadScenarios();
  }

  loadScenarios(): void {
    this.loading = true;
    this.scenarioService.getScenarios().subscribe({
      next: (scenarios) => {
        this.scenarios = scenarios;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openEditor(scenario?: Scenario): void {
    const dialogRef = this.dialog.open(ScenarioEditorComponent, {
      width: '90vw',
      height: '85vh',
      maxWidth: '1200px',
      data: { scenario: scenario || null },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (scenario) {
          this.scenarioService.updateScenario(scenario.id, result).subscribe({
            next: () => {
              this.loadScenarios();
              this.snackBar.open('Scénario mis à jour', 'OK', { duration: 3000 });
            },
          });
        } else {
          this.scenarioService.createScenario(result).subscribe({
            next: () => {
              this.loadScenarios();
              this.snackBar.open('Scénario créé', 'OK', { duration: 3000 });
            },
          });
        }
      }
    });
  }

  toggleScenario(scenario: Scenario): void {
    this.scenarioService.updateScenario(scenario.id, { enabled: !scenario.enabled }).subscribe({
      next: (updated) => {
        const idx = this.scenarios.findIndex(s => s.id === scenario.id);
        if (idx >= 0) this.scenarios[idx] = updated;
      },
    });
  }

  testScenario(scenario: Scenario): void {
    this.scenarioService.testScenario(scenario.id).subscribe({
      next: () => {
        this.snackBar.open(`Scénario "${scenario.name}" exécuté`, 'OK', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'exécution', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteScenario(scenario: Scenario): void {
    if (confirm(`Supprimer le scénario "${scenario.name}" ?`)) {
      this.scenarioService.deleteScenario(scenario.id).subscribe({
        next: () => {
          this.loadScenarios();
          this.snackBar.open('Scénario supprimé', 'OK', { duration: 3000 });
        },
      });
    }
  }

  formatDate(date: string | null): string {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleString('fr-FR');
  }
}
