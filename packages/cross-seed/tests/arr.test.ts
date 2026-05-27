import { describe, expect, it } from "vitest";
import { parseMediaIdsFromString } from "../src/arr.js";

describe("parseMediaIdsFromString", () => {
	describe("Plex format (curly braces)", () => {
		describe("IMDb IDs", () => {
			it("parses {imdb-tt12345} format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.{imdb-tt12345}.2023.1080p.WEB-DL",
				);
				expect(result.imdbId).toBe("tt12345");
				expect(result.tmdbId).toBeUndefined();
				expect(result.tvdbId).toBeUndefined();
				expect(result.tvMazeId).toBeUndefined();
			});

			it("parses {imdbid-tt12345} format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.{imdbid-tt12345}.2023.1080p",
				);
				expect(result.imdbId).toBe("tt12345");
			});

			it("parses {imdb-12345} format without tt prefix", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.{imdb-12345}.2023.1080p",
				);
				expect(result.imdbId).toBe("12345");
			});

			it("preserves tt prefix in IMDb IDs", () => {
				const result = parseMediaIdsFromString(
					"Movie.{imdb-tt1234567}.2023.1080p",
				);
				expect(result.imdbId).toBe("tt1234567");
			});
		});

		describe("TMDb IDs", () => {
			it("parses {tmdb-12345} format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.{tmdb-12345}.2023.1080p.WEB-DL",
				);
				expect(result.tmdbId).toBe("12345");
				expect(result.imdbId).toBeUndefined();
				expect(result.tvdbId).toBeUndefined();
				expect(result.tvMazeId).toBeUndefined();
			});

			it("parses {tmdbid-12345} format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.{tmdbid-12345}.S01.1080p.BluRay",
				);
				expect(result.tmdbId).toBe("12345");
			});
		});

		describe("TVDb IDs", () => {
			it("parses {tvdb-12345} format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.S01E01.{tvdb-12345}.1080p.WEB-DL",
				);
				expect(result.tvdbId).toBe("12345");
				expect(result.imdbId).toBeUndefined();
				expect(result.tmdbId).toBeUndefined();
				expect(result.tvMazeId).toBeUndefined();
			});

			it("parses {tvdbid-12345} format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.{tvdbid-12345}.S01.1080p",
				);
				expect(result.tvdbId).toBe("12345");
			});
		});

		describe("TVMaze IDs", () => {
			it("parses {tvmaze-12345} format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.S01E01.{tvmaze-12345}.1080p.WEB-DL",
				);
				expect(result.tvMazeId).toBe("12345");
				expect(result.imdbId).toBeUndefined();
				expect(result.tmdbId).toBeUndefined();
				expect(result.tvdbId).toBeUndefined();
			});

			it("parses {tvmazeid-12345} format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.{tvmazeid-12345}.S01E01",
				);
				expect(result.tvMazeId).toBe("12345");
			});
		});
	});

	describe("Jellyfin format (square brackets with hyphens)", () => {
		describe("IMDb IDs", () => {
			it("parses [imdbid-12345] format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.[imdbid-12345].2023.1080p.WEB-DL",
				);
				expect(result.imdbId).toBe("12345");
			});

			it("parses [imdb-12345] format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.[imdb-12345].2023.1080p",
				);
				expect(result.imdbId).toBe("12345");
			});
		});

		describe("TMDb IDs", () => {
			it("parses [tmdbid-12345] format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.[tmdbid-12345].2023.1080p.WEB-DL",
				);
				expect(result.tmdbId).toBe("12345");
			});

			it("parses [tmdb-12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.[tmdb-12345].S01.1080p.BluRay",
				);
				expect(result.tmdbId).toBe("12345");
			});
		});

		describe("TVDb IDs", () => {
			it("parses [tvdbid-12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.S01E01.[tvdbid-12345].1080p.WEB-DL",
				);
				expect(result.tvdbId).toBe("12345");
			});

			it("parses [tvdb-12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.[tvdb-12345].S01E01",
				);
				expect(result.tvdbId).toBe("12345");
			});
		});
	});

	describe("Emby format (square brackets with equals signs)", () => {
		describe("IMDb IDs", () => {
			it("parses [imdbid=12345] format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.[imdbid=12345].2023.1080p.WEB-DL",
				);
				expect(result.imdbId).toBe("12345");
			});

			it("parses [imdb=12345] format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.[imdb=12345].2023.1080p",
				);
				expect(result.imdbId).toBe("12345");
			});
		});

		describe("TMDb IDs", () => {
			it("parses [tmdbid=12345] format", () => {
				const result = parseMediaIdsFromString(
					"Movie.Name.[tmdbid=12345].2023.1080p.WEB-DL",
				);
				expect(result.tmdbId).toBe("12345");
			});

			it("parses [tmdb=12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.[tmdb=12345].S01.1080p.BluRay",
				);
				expect(result.tmdbId).toBe("12345");
			});
		});

		describe("TVDb IDs", () => {
			it("parses [tvdbid=12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.S01E01.[tvdbid=12345].1080p.WEB-DL",
				);
				expect(result.tvdbId).toBe("12345");
			});

			it("parses [tvdb=12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.[tvdb=12345].S01E01",
				);
				expect(result.tvdbId).toBe("12345");
			});
		});

		describe("TVMaze IDs", () => {
			it("parses [tvmazeid=12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.S01E01.[tvmazeid=12345].1080p",
				);
				expect(result.tvMazeId).toBe("12345");
			});

			it("parses [tvmaze=12345] format", () => {
				const result = parseMediaIdsFromString(
					"TV.Show.Name.[tvmaze=12345].S01E01.PROPER",
				);
				expect(result.tvMazeId).toBe("12345");
			});
		});
	});

	describe("mixed IDs", () => {
		it("parses multiple IDs from same string (Plex)", () => {
			const result = parseMediaIdsFromString(
				"Movie.{imdb-tt12345}.{tmdb-54321}.2023.1080p",
			);
			expect(result.imdbId).toBe("tt12345");
			expect(result.tmdbId).toBe("54321");
			expect(result.tvdbId).toBeUndefined();
			expect(result.tvMazeId).toBeUndefined();
		});

		it("parses multiple IDs from same string (Jellyfin)", () => {
			const result = parseMediaIdsFromString(
				"TV.Show.{tvdb-12345}.{tvmaze-67890}.S01E01",
			);
			expect(result.tvdbId).toBe("12345");
			expect(result.tvMazeId).toBe("67890");
			expect(result.imdbId).toBeUndefined();
			expect(result.tmdbId).toBeUndefined();
		});

		it("parses three IDs from same string", () => {
			const result = parseMediaIdsFromString(
				"Movie.{imdb-tt12345}.{tmdb-54321}.{tvdb-99999}.2023",
			);
			expect(result.imdbId).toBe("tt12345");
			expect(result.tmdbId).toBe("54321");
			expect(result.tvdbId).toBe("99999");
			expect(result.tvMazeId).toBeUndefined();
		});

		it("parses all four IDs from same string", () => {
			const result = parseMediaIdsFromString(
				"TV.Show.{imdb-tt12345}.{tmdb-54321}.{tvdb-67890}.{tvmaze-11111}.S01E01",
			);
			expect(result.imdbId).toBe("tt12345");
			expect(result.tmdbId).toBe("54321");
			expect(result.tvdbId).toBe("67890");
			expect(result.tvMazeId).toBe("11111");
		});
	});

	describe("edge cases", () => {
		it("handles IDs without brackets", () => {
			const result = parseMediaIdsFromString(
				"Movie.Name.imdb-tt12345.2023.1080p",
			);
			expect(result.imdbId).toBe("tt12345");
		});

		it("handles IDs without brackets (Jellyfin format)", () => {
			const result = parseMediaIdsFromString(
				"TV.Show.Name.tvdb-12345.S01E01",
			);
			expect(result.tvdbId).toBe("12345");
		});

		it("handles square brackets without hyphen prefix", () => {
			const result = parseMediaIdsFromString(
				"Movie.[imdb-tt12345].2023.1080p",
			);
			expect(result.imdbId).toBe("tt12345");
		});

		it("handles square brackets without hyphen prefix (Jellyfin)", () => {
			const result = parseMediaIdsFromString(
				"TV.Show.S01E01.[tvdb-12345]",
			);
			expect(result.tvdbId).toBe("12345");
		});

		it("returns empty object when no IDs found", () => {
			const result = parseMediaIdsFromString(
				"Movie.Name.2023.1080p.WEB-DL",
			);
			expect(result).toEqual({
				imdbId: undefined,
				tmdbId: undefined,
				tvdbId: undefined,
				tvMazeId: undefined,
			});
		});

		it("handles complex release names", () => {
			const result = parseMediaIdsFromString(
				"Movie.Name.{imdb-12345}.2023.REPACK.1080p.WEB-DL",
			);
			expect(result.imdbId).toBe("12345");
		});

		it("handles TV shows with PROPER tags", () => {
			const result = parseMediaIdsFromString(
				"TV.Show.Name.[tvmazeid=12345].S01E01.PROPER.1080p",
			);
			expect(result.tvMazeId).toBe("12345");
		});

		it("handles very long numbers", () => {
			const result = parseMediaIdsFromString(
				"Movie.{imdb-tt1234567890}.2023.1080p",
			);
			expect(result.imdbId).toBe("tt1234567890");
		});

		it("handles single digit numbers", () => {
			const result = parseMediaIdsFromString("Movie.{tmdb-1}.2023.1080p");
			expect(result.tmdbId).toBe("1");
		});
	});

	describe("case sensitivity", () => {
		it("handles uppercase ID prefixes", () => {
			const result = parseMediaIdsFromString(
				"Movie.{IMDB-TT12345}.{TMDB-54321}.2023",
			);
			expect(result.imdbId).toBe("TT12345");
			expect(result.tmdbId).toBe("54321");
		});

		it("handles mixed case ID prefixes", () => {
			const result = parseMediaIdsFromString(
				"Movie.{Imdb-Tt12345}.{Tmdb-54321}.2023",
			);
			expect(result.imdbId).toBe("Tt12345");
			expect(result.tmdbId).toBe("54321");
		});
	});

	describe("real-world examples", () => {
		it("handles typical Plex movie naming", () => {
			const result = parseMediaIdsFromString(
				"The.Dark.Knight.(2008).{imdb-tt0468569}.1080p.BluRay",
			);
			expect(result.imdbId).toBe("tt0468569");
		});

		it("handles typical Plex TV show naming", () => {
			const result = parseMediaIdsFromString(
				"Breaking.Bad.(2008).{tvdb-81189}.S01E01.1080p.BluRay",
			);
			expect(result.tvdbId).toBe("81189");
		});

		it("handles typical Jellyfin movie naming", () => {
			const result = parseMediaIdsFromString(
				"Inception.(2010).[tmdbid-27205].1080p.WEB-DL",
			);
			expect(result.tmdbId).toBe("27205");
		});

		it("handles typical Jellyfin TV show naming", () => {
			const result = parseMediaIdsFromString(
				"Game.of.Thrones.[tvdbid-121361].S01E01.1080p",
			);
			expect(result.tvdbId).toBe("121361");
		});

		it("handles typical Emby movie naming", () => {
			const result = parseMediaIdsFromString(
				"Interstellar.(2014).[imdbid=0816692].1080p.BluRay",
			);
			expect(result.imdbId).toBe("0816692");
		});

		it("handles typical Emby TV show naming", () => {
			const result = parseMediaIdsFromString(
				"Stranger.Things.[tmdbid=66732].S01E01.1080p",
			);
			expect(result.tmdbId).toBe("66732");
		});
	});

	describe("partial matches and noise", () => {
		it("extracts IDs from strings with extra text", () => {
			const result = parseMediaIdsFromString(
				"Some.Movie.Name.2023.1080p.{imdb-tt12345}.REPACK.WEB-DL",
			);
			expect(result.imdbId).toBe("tt12345");
		});

		it("handles IDs at the beginning of string", () => {
			const result = parseMediaIdsFromString(
				"{tmdb-12345}.Movie.Name.2023.1080p",
			);
			expect(result.tmdbId).toBe("12345");
		});

		it("handles IDs at the end of string", () => {
			const result = parseMediaIdsFromString(
				"Movie.Name.2023.1080p.{tvdb-12345}",
			);
			expect(result.tvdbId).toBe("12345");
		});
	});

	describe("folder ID parsing", () => {
		it("parses IDs from folder names when provided", () => {
			const folderIds = parseMediaIdsFromString(
				"Movie.Name.{imdb-tt12345}",
			);
			expect(folderIds.imdbId).toBe("tt12345");
		});

		it("parses IDs from folder names with square brackets", () => {
			const folderIds = parseMediaIdsFromString(
				"Show.Name.[tvdb-12345].Season.1",
			);
			expect(folderIds.tvdbId).toBe("12345");
		});

		it("parses IDs from folder names with equals signs", () => {
			const folderIds = parseMediaIdsFromString(
				"Show.Name.[tmdbid=54321].Season.1",
			);
			expect(folderIds.tmdbId).toBe("54321");
		});

		it("merges folder and filename IDs correctly", () => {
			const filenameIds = parseMediaIdsFromString(
				"episode.{tvdb-11111}.mkv",
			);
			const folderIds = parseMediaIdsFromString(
				"Show.Name.{tvdb-22222}.Season.1",
			);
			const merged = { ...folderIds, ...filenameIds };

			expect(merged.tvdbId).toBe("11111"); // Filename takes precedence
		});

		it("uses folder IDs when filename has no IDs", () => {
			const filenameIds = parseMediaIdsFromString("episode.mkv");
			const folderIds = parseMediaIdsFromString(
				"Show.Name.{imdb-tt12345}.Season.1",
			);
			const merged = { ...folderIds, ...filenameIds };

			expect(merged.imdbId).toBe("tt12345"); // Folder ID used
		});

		it("handles folder names with complex paths", () => {
			// Test extracting folder name from complex path and parsing IDs
			const mockPath = "/Shows/Show.Name.{tvdb-12345}/Season 1";
			// Extract the parent folder name that contains the IDs
			const pathParts = mockPath.split("/").filter(Boolean);
			const folderName = pathParts[pathParts.length - 2] || ""; // Get "Show.Name.{tvdb-12345}"
			const folderIds = parseMediaIdsFromString(folderName);
			expect(folderIds.tvdbId).toBe("12345");
		});
	});

	describe("integration with scanAllArrsForMedia", () => {
		// Note: These tests verify the parsing logic integration
		// Actual Arr API calls would require mocking the Arr instances

		it("combines folder and filename IDs correctly", async () => {
			// Mock the behavior without actual API calls
			const title = "Show.Name.S01E01";
			const folderPath = "/Shows/Show.Name.{tvdb-12345}";

			const titleIds = parseMediaIdsFromString(title);
			const folderName = folderPath.split("/").pop() || folderPath;
			const folderIds = parseMediaIdsFromString(folderName);
			const combined = { ...folderIds, ...titleIds };

			// Verify folder ID parsing works
			expect(folderIds.tvdbId).toBe("12345");
			expect(combined.tvdbId).toBe("12345");
		});

		it("handles path with different separators", async () => {
			const windowsPath = "Shows\\Show.Name.{imdb-tt12345}";
			const unixPath = "Shows/Show.Name.{imdb-tt12345}";

			const windowsFolder = windowsPath.split("\\").pop() || windowsPath;
			const unixFolder = unixPath.split("/").pop() || unixPath;

			const windowsIds = parseMediaIdsFromString(windowsFolder);
			const unixIds = parseMediaIdsFromString(unixFolder);

			expect(windowsIds.imdbId).toBe("tt12345");
			expect(unixIds.imdbId).toBe("tt12345");
		});

		it("uses filename IDs when folder has no IDs", () => {
			const title = "Show.Name.S01E01.{tmdb-54321}";
			const folderPath = "/Shows/Show.Name.Season.1";

			const titleIds = parseMediaIdsFromString(title);
			const folderName = folderPath.split("/").pop() || folderPath;
			const folderIds = parseMediaIdsFromString(folderName);
			const combined = { ...folderIds, ...titleIds };

			expect(titleIds.tmdbId).toBe("54321");
			expect(folderIds.tmdbId).toBeUndefined();
			expect(combined.tmdbId).toBe("54321");
		});

		it("merges complementary IDs from folder and filename", () => {
			const title = "Show.S01E01.{tmdb-11111}";
			const folderPath = "/Shows/Show.Name.{tvdb-22222}";

			const titleIds = parseMediaIdsFromString(title);
			const folderName = folderPath.split("/").pop() || folderPath;
			const folderIds = parseMediaIdsFromString(folderName);
			const combined = { ...folderIds, ...titleIds };

			// Filename takes precedence for same ID type, but different types are merged
			expect(combined.tmdbId).toBe("11111"); // From filename
			expect(combined.tvdbId).toBe("22222"); // From folder
			expect(folderIds.tvdbId).toBe("22222"); // Verify folder was parsed
		});
	});
});
